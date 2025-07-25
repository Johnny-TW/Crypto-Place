const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const COIN_LIST = `${API_BASE_URL}/api/coins/markets`;
export const COIN_DATA_ID = `${API_BASE_URL}/api/coins/bitcoin`;
export const COIN_MARKET_DATA = `${API_BASE_URL}/api/coins/bitcoin/market_chart`;
export const CRYPTO_DETAILS = `${API_BASE_URL}/api/coins`;
export const CRYPTO_DETAILS_CHART = `${API_BASE_URL}/api/crypto-details/chart/bitcoin`;
export const CRYPTO_MARKET_LIST = `${API_BASE_URL}/api/crypto-market-list`;
export const NFT_LIST = `${API_BASE_URL}/api/nfts/list`;
export const NFT_DATA_ID = `${API_BASE_URL}/api/nfts/pudgy-penguins`;
export const NFT_DETAILS = `${API_BASE_URL}/api/nfts`;
export const CRYPTO_NEWS = `${API_BASE_URL}/api/news`;
export const EXCHANGE_DETAILS = `${API_BASE_URL}/api/exchanges`;
export const EMPLOYEE_INFO = `${API_BASE_URL}/api/employee`;
export const EMPLOYEES_LIST = `${API_BASE_URL}/api/employees`;
