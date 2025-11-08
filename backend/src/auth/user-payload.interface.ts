import { JwtPayload } from './jwt-payload.interface';

// UserPayload 介面繼承自 JwtPayload，並添加額外的用戶資訊
export interface UserPayload extends JwtPayload {
  id: number;
  emplid: string;
  name: string;
}
