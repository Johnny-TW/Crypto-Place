// JWT Payload 介面定義
export interface JwtPayload {
  sub: number | string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
  loginType?: 'user' | 'employee';
  name?: string;
  emplId?: string;
}
