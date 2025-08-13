import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { ApiModule } from './controllers/api/api.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './controllers/user/user.module';
import { AuthModule } from './controllers/auth/auth.module';
import { JwtAuthGuard } from './controllers/auth/guards/jwt-auth.guard';
import { PostsModule } from './controllers/posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    PrismaModule,
    AuthModule,
    ApiModule,
    UserModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
