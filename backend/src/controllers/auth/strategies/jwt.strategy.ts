import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../../../auth/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    try {
      // 檢查是否為員工登入 token
      if (
        payload.loginType === 'employee' ||
        (typeof payload.sub === 'string' && payload.sub.startsWith('employee_'))
      ) {
        // 員工登入：直接返回 payload 中的用戶資料
        return {
          id: 0, // 虛擬 ID
          email: payload.email,
          name: payload.name,
          role: payload.role,
          emplId: payload.emplId,
          loginType: 'employee',
          isActive: true,
        };
      } else {
        // 一般用戶登入：從資料庫驗證
        const user = await this.authService.validateUser(payload.sub as number);
        return user;
      }
    } catch (error) {
      throw new UnauthorizedException('無效的令牌');
    }
  }
}
