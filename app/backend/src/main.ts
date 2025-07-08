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

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:4200',
      'http://10.33.29.200:5173',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002',
    ],
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
    .setTitle('Crypto Place API')
    .setDescription(
      'Crypto Place 應用程式的 API 文檔 - 提供加密貨幣、NFT、新聞等數據',
    )
    .setVersion('2.0.0')
    .addTag('crypto', '加密貨幣相關 API')
    .addTag('nft', 'NFT 相關 API')
    .addTag('news', '新聞相關 API')
    .addTag('market', '市場相關 API')
    .addServer('http://localhost:5001', '本地開發環境')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Crypto Place API 文檔',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #1f2937; font-size: 2rem; }
      .swagger-ui .info .description { color: #374151; }
      .swagger-ui .scheme-container { background: #f3f4f6; padding: 20px; border-radius: 8px; }
    `,
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
  });

  const port = configService.get('port') || 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server is running on port ${port} and accessible externally`);
  console.log(`📋 API endpoints available at http://localhost:${port}/api`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🌐 CORS enabled for:`);
  console.log(`   - http://localhost:5173 (Vite)`);
  console.log(`   - http://localhost:3000 (Create React App)`);
  console.log(`   - http://10.33.29.200:5173`);
}

void bootstrap();
