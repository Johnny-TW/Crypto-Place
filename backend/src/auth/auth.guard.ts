import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserPayload } from './user-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // 從請求中取得 header
      const request: Request = context.switchToHttp().getRequest();

      // token 等於 header的Authorization 的值
      const token: string = request.headers.authorization.split(' ')[1];

      // 如果沒有 token，直接拒絕
      if (!token) throw new UnauthorizedException();

      // 這是解碼 token 的部分
      const payload: UserPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      //--------------------------------------------------------------------------
      request.user = payload;

      return true;
    } catch (err: unknown) {
      throw new UnauthorizedException();
    }
  }
}
