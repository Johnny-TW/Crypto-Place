/**
 * API 服務層配置
 * 
 * 這個檔案提供統一的 HTTP 請求配置和方法
 * 
 * 架構作用：
 * 1. 統一配置 axios 實例
 * 2. 設定請求超時時間
 * 3. 統一管理 HTTP 方法
 * 4. 方便加入攔截器（interceptors）
 * 
 * 使用場景：
 * 1. 在 Saga 中發送 HTTP 請求
 * 2. 統一處理請求/響應格式
 * 3. 統一錯誤處理
 */

import axios from 'axios';

/**
 * 1. 創建 Axios 實例
 * 
 * 好處：
 * - 統一配置基礎 URL
 * - 設定全域請求超時時間
 * - 可以加入請求/響應攔截器
 * - 與預設 axios 實例隔離
 */
export const APIKit = axios.create({
  baseURL: import.meta.env.VITE_FE_HOST,  // 從環境變數讀取前端主機地址
  timeout: 30000,                         // 設定請求超時時間為 30 秒
});

/**
 * 2. HTTP 方法常數定義
 * 
 * 好處：
 * - 避免字串拼寫錯誤
 * - 統一管理 HTTP 方法
 * - 提供程式碼提示
 * - 便於維護和重構
 */
export const API_METHOD = {
  GET: 'get',       // 獲取資料
  POST: 'post',     // 創建資料
  PUT: 'put',       // 更新資料（完整更新）
  PATCH: 'patch',   // 更新資料（部分更新）
  DELETE: 'delete', // 刪除資料
};

/**
 * 使用範例：
 * 
 * 在 Saga 中使用：
 * import { APIKit, API_METHOD } from '../api/apiService';
 * 
 * const response = yield call(APIKit.request, {
 *   method: API_METHOD.GET,
 *   url: '/api/users',
 *   headers: { Authorization: `Bearer ${token}` }
 * });
 * 
 * 或者直接使用：
 * const response = yield call(APIKit.get, '/api/users');
 */

/**
 * 未來可擴展功能：
 * 
 * 1. 請求攔截器（Request Interceptor）：
 * APIKit.interceptors.request.use(config => {
 *   const token = localStorage.getItem('token');
 *   if (token) {
 *     config.headers.Authorization = `Bearer ${token}`;
 *   }
 *   return config;
 * });
 * 
 * 2. 響應攔截器（Response Interceptor）：
 * APIKit.interceptors.response.use(
 *   response => response,
 *   error => {
 *     if (error.response?.status === 401) {
 *       // 處理身份驗證失敗
 *     }
 *     return Promise.reject(error);
 *   }
 * );
 */
