import { JwtPayload } from '../../auth/jwt-payload.interface';

declare global {
  namespace Express {
    export interface Request {
      user: JwtPayload;
    }
  }
}
