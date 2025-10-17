import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000, // 增加到 30 秒以應對 CoinGecko API 延遲
      maxRedirects: 5,
    }),
  ],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
