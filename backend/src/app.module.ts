import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { ApiModule } from './controllers/api/api.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './controllers/user/user.module';
import { AuthModule } from './controllers/auth/auth.module';
import { PostsModule } from './controllers/posts/posts.module';
import { WatchlistModule } from './controllers/watchlist/watchlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      // 從根目錄載入整合的環境變數檔案
      // 優先級: 根目錄 .env.{環境} > 後端目錄 .env.{環境} > 根目錄 .env
      envFilePath: [
        // 根目錄環境檔案（整合配置）- 優先載入
        '../.env.dev',  // 開發環境預設檔案
        `../.env.${process.env.ENVIRONMENT || process.env.NODE_ENV || 'dev'}`,
        `../.env.local`,
        '../.env',
        // 後端目錄環境檔案（向下相容）
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env.local',
        '.env',
      ],
    }),
    HttpModule.register({
      timeout: 30000, // 增加到 30 秒以應對外部 API 延遲
      maxRedirects: 5,
    }),
    PrismaModule,
    AuthModule,
    ApiModule,
    UserModule,
    PostsModule,
    WatchlistModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
