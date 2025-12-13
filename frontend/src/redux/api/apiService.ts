import axios from 'axios';
import { CANCEL } from 'redux-saga';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (import.meta.env.DEV || import.meta.env.VITE_ENV === 'testing') {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:5001/api`;
  }

  return '/api';
};

export const APIKit = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
});

export const API_METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
};

// API call function with cancellation support
export const call = ({
  method,
  path,
  params: originParams = {},
  data,
}: {
  method: string;
  path: string;
  params?: any;
  data?: any;
}) => {
  const source = axios.CancelToken.source();

  // 為 GET/DELETE 請求，originParams 應該包含 params 和 headers
  // 為 POST/PUT/PATCH 請求，originParams 應該包含 headers
  const config = {
    ...originParams,
    cancelToken: source.token,
  };

  const promise =
    method === API_METHOD.GET || method === API_METHOD.DELETE
      ? (APIKit as any)[method](path, config)
      : (APIKit as any)[method](path, data, config);

  // Attach cancel method to promise for redux-saga
  promise[CANCEL] = () => source.cancel();

  return promise;
};
