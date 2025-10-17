import Cookies from 'js-cookie';

/**
 * Watchlist API Service
 * 注意：這些方法主要供 Redux Saga 使用，不應直接在組件中調用
 * 組件應使用 useWatchlist hook 來與 Redux 狀態交互
 */

// 創建認證配置的輔助函數
const getAuthConfig = () => {
  const token = Cookies.get('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  };
};

export const watchlistService = {
  // 返回認證配置，供 saga 使用
  getAuthConfig,
};

export default watchlistService;
