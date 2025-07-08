const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Coin List API
// export const COIN_LIST = 'https://api.coingecko.com/api/v3/coins/markets/';
// export const COIN_DATA_ID = 'https://api.coingecko.com/api/v3/coins/bitcoin';
// // NFT List API
// export const NFT_LIST = 'https://api.coingecko.com/api/v3/nfts/list';
// export const NFT_DATA_ID = 'https://api.coingecko.com/api/v3/nfts/pudgy-penguins';
// // Market List API
// export const COIN_MARKET_DATA = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart';
// // Market List API
// export const CRYPTO_NEWS = 'https://data-api.cryptocompare.com/news/v1/article/list';
// // Crypto Details API
// export const CRYPTO_DETAILS = 'https://api.coingecko.com/api/v3/coins';
// // Crypto Details Chart API
// export const CRYPTO_DETAILS_CHART = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart';
// // Market List API
// export const CRYPTO_MARKET_LIST = 'https://api.coingecko.com/api/v3/exchanges';

// Coin List API
export const COIN_LIST = `${API_BASE_URL}/api/coins/markets`;
export const COIN_DATA_ID = `${API_BASE_URL}/api/coins/bitcoin`;
// NFT List API
export const NFT_LIST = `${API_BASE_URL}/api/nfts/list`;
export const NFT_DATA_ID = `${API_BASE_URL}/api/nfts/pudgy-penguins`;
export const NFT_DETAILS = `${API_BASE_URL}/api/nfts`;
// Market List API
export const COIN_MARKET_DATA = `${API_BASE_URL}/api/coins/bitcoin/market_chart`;
// Market List API
export const CRYPTO_NEWS = `${API_BASE_URL}/api/news`;
// Crypto Details API
export const CRYPTO_DETAILS = `${API_BASE_URL}/api/coins`;
// Crypto Details Chart API
export const CRYPTO_DETAILS_CHART = `${API_BASE_URL}/api/crypto-details/chart/bitcoin`;
// Market List API
export const CRYPTO_MARKET_LIST = `${API_BASE_URL}/api/crypto-market-list`;
// Exchange Details List API
export const EXCHANGE_DETAILS = `${API_BASE_URL}/api/exchanges`;

// Employee APIs
export const EMPLOYEE_INFO = `${API_BASE_URL}/api/employee`;
export const EMPLOYEES_LIST = `${API_BASE_URL}/api/employees`;
