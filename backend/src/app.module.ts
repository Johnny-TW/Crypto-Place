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
    WatchlistModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
