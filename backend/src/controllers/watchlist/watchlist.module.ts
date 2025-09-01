import { Module } from '@nestjs/common';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ApiModule } from '../api/api.module';

@Module({
  imports: [PrismaModule, ApiModule],
  controllers: [WatchlistController],
  providers: [WatchlistService],
  exports: [WatchlistService],
})
export class WatchlistModule {}