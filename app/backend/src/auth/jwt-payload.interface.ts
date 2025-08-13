export interface JwtPayload {
  sub: number | string; // 支援一般用戶的數字 ID 和員工的字串 ID
  email: string;
  role: string;
  iat?: number;
  exp?: number;
  // 員工登入額外欄位
  loginType?: 'user' | 'employee';
  name?: string;
  emplId?: string;
}
