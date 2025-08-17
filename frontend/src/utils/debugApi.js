/**
 * Debug API URL configuration
 */
import { getApiBaseUrl } from './apiConfig';

const debugApiConfig = () => {
  /* eslint-disable no-console */
  console.log('=== API Configuration Debug ===');
  console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('DEV mode:', import.meta.env.DEV);
  console.log('window.location.protocol:', window.location.protocol);
  console.log('window.location.hostname:', window.location.hostname);
  console.log('Generated API Base URL:', getApiBaseUrl());
  console.log('================================');
  /* eslint-enable no-console */

  return {
    env: import.meta.env.VITE_API_BASE_URL,
    dev: import.meta.env.DEV,
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    apiBaseUrl: getApiBaseUrl(),
  };
};

// 在瀏覽器控制台可以呼叫 window.debugApi()
if (typeof window !== 'undefined') {
  window.debugApi = debugApiConfig;
}

export default debugApiConfig;
