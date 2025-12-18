import { Configuration, PopupRequest } from '@azure/msal-browser';

// Azure AD 配置
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_AD_CLIENT_ID || '',
    // 使用 'consumers' 支援個人 Microsoft 帳戶
    // 使用 'common' 支援工作/學校帳戶和個人帳戶
    // 使用特定的 tenant ID 只支援該組織的帳戶
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_AD_TENANT_ID || 'common'}`,
    redirectUri:
      import.meta.env.VITE_AZURE_AD_REDIRECT_URI || window.location.origin,
    // 如果應用程式配置為單一租戶，需要設置 knownAuthorities
    // knownAuthorities: [import.meta.env.VITE_AZURE_AD_TENANT_ID ? `login.microsoftonline.com/${import.meta.env.VITE_AZURE_AD_TENANT_ID}` : ''],
  },
  cache: {
    cacheLocation: 'sessionStorage', // 使用 sessionStorage 提升安全性
    storeAuthStateInCookie: false, // 設為 true 以支援 IE11
  },
};
// 登入請求配置
export const loginRequest: PopupRequest = {
  scopes: ['openid', 'profile', 'email'],
};

// Backend API 端點
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
export const AZURE_LOGIN_URL = `${BACKEND_URL}/api/auth/azure/login`;
