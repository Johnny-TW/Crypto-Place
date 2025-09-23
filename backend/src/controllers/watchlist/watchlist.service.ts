import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiService } from '../api/api.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { WatchlistWithPriceDto } from './dto/watchlist-response.dto';

@Injectable()
export class WatchlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiService: ApiService,
  ) {}

  async addToWatchlist(userId: number, createWatchlistDto: CreateWatchlistDto) {
    // 確保 userId 是數字類型
    const userIdNum = Number(userId);

    if (isNaN(userIdNum)) {
      throw new Error('Invalid userId: must be a number');
    }

    // 檢查是否已經在最愛列表中
    const existingItem = await this.prisma.watchlist.findUnique({
      where: {
        userId_coinId: {
          userId: userIdNum,
          coinId: createWatchlistDto.coinId,
        },
      },
    });

    if (existingItem) {
      throw new ConflictException('此幣種已在您的最愛列表中');
    }

    // 新增到最愛列表
    return this.prisma.watchlist.create({
      data: {
        userId: userIdNum,
        ...createWatchlistDto,
      },
    });
  }

  async removeFromWatchlist(userId: number, coinId: string) {
    // 確保 userId 是數字類型
    const userIdNum = Number(userId);

    if (isNaN(userIdNum)) {
      throw new Error('Invalid userId: must be a number');
    }

    const watchlistItem = await this.prisma.watchlist.findUnique({
      where: {
        userId_coinId: {
          userId: userIdNum,
          coinId: coinId,
        },
      },
    });

    if (!watchlistItem) {
      throw new NotFoundException('在您的最愛列表中找不到此幣種');
    }

    return this.prisma.watchlist.delete({
      where: {
        userId_coinId: {
          userId: userIdNum,
          coinId: coinId,
        },
      },
    });
  }

  async getUserWatchlist(userId: number): Promise<WatchlistWithPriceDto[]> {
    // 確保 userId 是數字類型
    const userIdNum = Number(userId);

    if (isNaN(userIdNum)) {
      throw new Error('Invalid userId: must be a number');
    }

    // 獲取用戶的最愛列表
    const watchlist = await this.prisma.watchlist.findMany({
      where: { userId: userIdNum },
      orderBy: { createdAt: 'desc' },
    });

    if (watchlist.length === 0) {
      return [];
    }

    // 從 CoinGecko 獲取即時價格資料
    try {
      const coinIds = watchlist.map(item => item.coinId).join(',');
      const marketData = await this.apiService.getCoinsMarkets({
        ids: coinIds,
        vs_currency: 'usd',
        per_page: watchlist.length,
        page: 1,
      });

      // 合併最愛列表資料和市場資料
      const watchlistWithPrice: WatchlistWithPriceDto[] = watchlist.map(item => {
        const coinData = marketData.find((coin: any) => coin.id === item.coinId);

        return {
          id: item.id,
          userId: item.userId,
          coinId: item.coinId,
          coinName: item.coinName,
          symbol: item.symbol,
          image: item.image,
          createdAt: item.createdAt,
          currentPrice: coinData?.current_price,
          priceChange24h: coinData?.price_change_percentage_24h,
          marketCap: coinData?.market_cap,
        };
      });

      return watchlistWithPrice;
    } catch (error) {
      console.error('獲取市場資料時發生錯誤:', error);
      // 如果 API 失敗，只返回基本資料
      return watchlist;
    }
  }

  async isInWatchlist(userId: number, coinId: string): Promise<boolean> {
    // 確保 userId 是數字類型
    const userIdNum = Number(userId);

    if (isNaN(userIdNum)) {
      throw new Error('Invalid userId: must be a number');
    }

    const item = await this.prisma.watchlist.findUnique({
      where: {
        userId_coinId: {
          userId: userIdNum,
          coinId: coinId,
        },
      },
    });

    return !!item;
  }

  async checkBatchInWatchlist(userId: number, coinIds: string[]): Promise<Record<string, boolean>> {
    // 確保 userId 是數字類型
    const userIdNum = Number(userId);

    if (isNaN(userIdNum)) {
      throw new Error('Invalid userId: must be a number');
    }

    // 一次性查詢所有相關的收藏記錄
    const watchlistItems = await this.prisma.watchlist.findMany({
      where: {
        userId: userIdNum,
        coinId: { in: coinIds },
      },
      select: {
        coinId: true,
      },
    });

    // 建立收藏狀態對照表
    const watchlistMap = new Set(watchlistItems.map(item => item.coinId));

    // 返回每個 coinId 的收藏狀態
    return coinIds.reduce((result, coinId) => {
      result[coinId] = watchlistMap.has(coinId);
      return result;
    }, {} as Record<string, boolean>);
  }

  async getWatchlistCount(userId: number): Promise<number> {
    // 確保 userId 是數字類型
    const userIdNum = Number(userId);

    if (isNaN(userIdNum)) {
      throw new Error('Invalid userId: must be a number');
    }

    return this.prisma.watchlist.count({
      where: { userId: userIdNum },
    });
  }
}
