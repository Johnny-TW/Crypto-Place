import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// 創建 axios 實例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 請求攔截器 - 自動添加認證 token
apiClient.interceptors.request.use(
  config => {
    const token = Cookies.get('token');
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 回應攔截器 - 處理錯誤
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token 過期或無效，清除 cookie 存儲並觸發登出 action
      Cookies.remove('token');
      // 觸發 Redux action 來處理登出，而不是直接重定向
      // eslint-disable-next-line no-underscore-dangle
      if (window.__APP_DISPATCH__) {
        // eslint-disable-next-line no-underscore-dangle
        window.__APP_DISPATCH__({ type: 'LOGOUT_SUCCESS' });
      }
    }
    return Promise.reject(error);
  }
);

export const watchlistService = {
  // 獲取用戶最愛列表
  async getUserWatchlist() {
    try {
      const response = await apiClient.get('/watchlist');
      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('獲取最愛列表失敗:', error);
      throw error;
    }
  },

  // 新增幣種到最愛
  async addToWatchlist(coinData) {
    try {
      const response = await apiClient.post('/watchlist', coinData);
      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('新增到最愛失敗:', error);
      throw error;
    }
  },

  // 從最愛移除幣種
  async removeFromWatchlist(coinId) {
    try {
      const response = await apiClient.delete(`/watchlist/${coinId}`);
      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('從最愛移除失敗:', error);
      throw error;
    }
  },

  // 檢查幣種是否在最愛中
  async checkIsInWatchlist(coinId) {
    try {
      const response = await apiClient.get(`/watchlist/check/${coinId}`);
      return response.data.isInWatchlist;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('檢查最愛狀態失敗:', error);

      // 如果是認證錯誤，返回 false 而不是拋出錯誤
      if (error.response?.status === 401) {
        // eslint-disable-next-line no-console
        console.log('用戶未登錄，無法檢查收藏狀態');
        return false;
      }

      throw error;
    }
  },

  // 批量檢查多個幣種是否在最愛中
  async checkBatchInWatchlist(coinIds) {
    try {
      if (!Array.isArray(coinIds) || coinIds.length === 0) {
        return {};
      }

      const response = await apiClient.post('/watchlist/check-batch', {
        coinIds,
      });
      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('批量檢查最愛狀態失敗:', error);

      // 如果是認證錯誤，返回空對象而不是拋出錯誤
      if (error.response?.status === 401) {
        // eslint-disable-next-line no-console
        console.log('用戶未登錄，無法檢查收藏狀態');
        return coinIds.reduce(
          (acc, coinId) => ({
            ...acc,
            [coinId]: false,
          }),
          {}
        );
      }

      throw error;
    }
  },

  // 獲取最愛數量
  async getWatchlistCount() {
    try {
      const response = await apiClient.get('/watchlist/count');
      return response.data.count;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('獲取最愛數量失敗:', error);
      throw error;
    }
  },
};

export default watchlistService;
