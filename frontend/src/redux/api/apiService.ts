import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (import.meta.env.DEV || import.meta.env.VITE_ENV === 'testing') {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:5001`;
  }

  return '/api';
};

export const APIKit = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
});

// export const APIKit = axios.create({
//   baseURL: import.meta.env.VITE_FE_HOST,
//   timeout: 30000,
// });

export const API_METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
};
