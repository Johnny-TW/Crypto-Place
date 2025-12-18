import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { MsalService } from './services/msal.service';
import { GoogleOAuthService } from './services/google-oauth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { DspHrApiService } from '../../services/api/dsp.hr.api.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as fsStore from 'cache-manager-fs-hash';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '24h',
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      store: fsStore,
      options: {
        path: 'cache', // 快取檔案存儲位置
        ttl: 60 * 60, // 項目在快取中的存活時間（秒）
        maxsize: 1000 * 1000 * 1000, // 快取大小限制，單位為字節
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    MsalService,
    GoogleOAuthService,
    DspHrApiService,
  ],
  exports: [AuthService, JwtAuthGuard, RolesGuard, MsalService, GoogleOAuthService],
})
export class AuthModule {}
