import axios from 'axios';

export const APIKit = axios.create({
  baseURL: import.meta.env.VITE_JSON_SERVER_URL || 'http://localhost:3002',
  timeout: 60000,
});

export const API_METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
};
