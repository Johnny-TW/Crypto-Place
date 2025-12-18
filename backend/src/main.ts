import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Cookie parser middleware
  app.use(cookieParser());

  // Session middleware (必須在 passport-azure-ad 使用 session 模式時啟用)
  app.use(
    session({
      secret: configService.get<string>('JWT_SECRET') || 'session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // 開發環境設為 false，生產環境應設為 true
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // 1 小時
        sameSite: 'lax',
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // CORS 配置 - 基於環境動態設定
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  const frontendUrl = configService.get<string>('FRONTEND_URL');

  // 解析 CORS_ORIGIN（支援逗號分隔的多個 origin）
  const corsOrigins = corsOrigin
    ? corsOrigin
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [
        frontendUrl,
        'http://localhost:5173',
        'http://localhost:3001',
        'http://127.0.0.1:5173',
      ].filter(Boolean);

  // 開發環境下使用動態 CORS，允許內網 IP 訪問
  const corsOriginHandler =
    process.env.NODE_ENV === 'production'
      ? corsOrigins
      : (
          origin: string,
          callback: (err: Error | null, allow?: boolean) => void,
        ) => {
          const isWhitelisted = corsOrigins.includes(origin);
          const isPrivateIP =
            /^https?:\/\/(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})(:\d+)?$/.test(
              origin,
            );
          // 這是為了允許 Postman 或其他沒有 origin header 的工具訪問 API
          const isUndefined = !origin;
          // Azure AD form_post 會發送 origin: 'null' (字串)
          const isNullOrigin = origin === 'null';
          // 允許白名單域名、內網 IP 範圍及無 origin 的請求（如 Postman、Azure AD callback）

          if (isWhitelisted || isPrivateIP || isUndefined || isNullOrigin) {
            callback(null, true);
          } else {
            console.warn(`⚠️  CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
          }
        };

  app.enableCors({
    origin: corsOriginHandler,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('EE40 - Crypto Place API')
    .setDescription(
      'EE40 - Crypto Place 應用程式的 API 文檔 - 提供加密貨幣、NFT、新聞等數據',
    )
    .setVersion('2.0.0')
    .addTag('auth', '認證相關 API')
    .addTag('User', '用戶管理 API')
    .addTag('posts', '貼文管理 API')
    .addTag('crypto', '加密貨幣相關 API')
    .addTag('nft', 'NFT 相關 API')
    .addTag('news', '新聞相關 API')
    .addTag('market', '市場相關 API')
    .addTag('system', '系統相關 API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '輸入 JWT 令牌',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:5001', '本地開發環境')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') || 5001;

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server is running on port ${port} and accessible externally`);
  console.log(`📋 API endpoints available at http://localhost:${port}/api`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🌐 CORS enabled for ${process.env.NODE_ENV} environment:`);

  if (process.env.NODE_ENV === 'production') {
    corsOrigins.forEach((origin, index) => {
      if (origin) {
        console.log(`   ${index + 1}. ${origin}`);
      }
    });
  } else {
    console.log(`   ✓ Whitelisted origins:`);
    corsOrigins.forEach((origin, index) => {
      console.log(`     ${index + 1}. ${origin}`);
    });
    console.log(
      `   ✓ Private IP ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x)`,
    );
    console.log(`   ✓ Postman and other tools without origin header`);
  }
}

void bootstrap();
