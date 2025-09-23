import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // CORS 配置 - 基於環境動態設定
  const corsOrigins = process.env.NODE_ENV === 'production'
    ? [
        // 生產環境的實際域名
        configService.get<string>('FRONTEND_URL'),
      ].filter(Boolean)
    : [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
      ];

  app.enableCors({
    origin: corsOrigins,
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
  corsOrigins.forEach((origin, index) => {
    if (origin) {
      console.log(`${index + 1}. ${origin}`);
    }
  });
}

void bootstrap();
