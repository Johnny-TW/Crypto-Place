const API_PORT = '5001';

export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (import.meta.env.DEV) {
    const { protocol } = window.location;
    const { hostname } = window.location;
    return `${protocol}//${hostname}:${API_PORT}`;
  }

  return '/api';
};

export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/health`);
    return response.ok;
  } catch {
    return false;
  }
};

export default getApiBaseUrl;
