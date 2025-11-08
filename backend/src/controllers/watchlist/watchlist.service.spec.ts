import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiService } from '../api/api.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';

describe('WatchlistService', () => {
  let service: WatchlistService;
  let _prismaService: PrismaService;
  let _apiService: ApiService;

  const mockPrismaService = {
    watchlist: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockApiService = {
    getCoinsMarkets: jest.fn(),
  };

  const mockWatchlistItem = {
    id: 1,
    userId: 1,
    coinId: 'bitcoin',
    coinName: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
  };

  const mockCreateWatchlistDto: CreateWatchlistDto = {
    coinId: 'bitcoin',
    coinName: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  };

  const mockMarketData = [
    {
      id: 'bitcoin',
      current_price: 50000,
      price_change_percentage_24h: 2.5,
      market_cap: 1000000000,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchlistService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ApiService,
          useValue: mockApiService,
        },
      ],
    }).compile();

    service = module.get<WatchlistService>(WatchlistService);
    _prismaService = module.get<PrismaService>(PrismaService);
    _apiService = module.get<ApiService>(ApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToWatchlist', () => {
    const userId = 1;

    it('should add a new item to watchlist successfully', async () => {
      mockPrismaService.watchlist.findUnique.mockResolvedValue(null);
      mockPrismaService.watchlist.create.mockResolvedValue(mockWatchlistItem);

      const result = await service.addToWatchlist(userId, mockCreateWatchlistDto);

      expect(result).toEqual(mockWatchlistItem);
      expect(mockPrismaService.watchlist.findUnique).toHaveBeenCalledWith({
        where: {
          userId_coinId: {
            userId: userId,
            coinId: mockCreateWatchlistDto.coinId,
          },
        },
      });
      expect(mockPrismaService.watchlist.create).toHaveBeenCalledWith({
        data: {
          userId: userId,
          ...mockCreateWatchlistDto,
        },
      });
    });

    it('should throw ConflictException when item already exists', async () => {
      mockPrismaService.watchlist.findUnique.mockResolvedValue(mockWatchlistItem);

      await expect(
        service.addToWatchlist(userId, mockCreateWatchlistDto),
      ).rejects.toThrow(ConflictException);

      expect(mockPrismaService.watchlist.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.watchlist.create).not.toHaveBeenCalled();

      // Test the specific error message
      await expect(
        service.addToWatchlist(userId, mockCreateWatchlistDto),
      ).rejects.toThrow('此幣種已在您的最愛列表中');
    });

    it('should handle invalid userId', async () => {
      const invalidUserId = NaN;

      await expect(
        service.addToWatchlist(invalidUserId, mockCreateWatchlistDto),
      ).rejects.toThrow('Invalid userId: must be a number');
    });

    it('should handle string userId by converting to number', async () => {
      mockPrismaService.watchlist.findUnique.mockResolvedValue(null);
      mockPrismaService.watchlist.create.mockResolvedValue(mockWatchlistItem);

      const stringUserId = '1';
      const result = await service.addToWatchlist(stringUserId as unknown as number, mockCreateWatchlistDto);

      expect(result).toEqual(mockWatchlistItem);
      expect(mockPrismaService.watchlist.findUnique).toHaveBeenCalledWith({
        where: {
          userId_coinId: {
            userId: 1,
            coinId: mockCreateWatchlistDto.coinId,
          },
        },
      });
    });

    it('should handle database errors during creation', async () => {
      mockPrismaService.watchlist.findUnique.mockResolvedValue(null);
      const dbError = new Error('Database connection failed');
      mockPrismaService.watchlist.create.mockRejectedValue(dbError);

      await expect(
        service.addToWatchlist(userId, mockCreateWatchlistDto),
      ).rejects.toThrow('Database connection failed');
    });
  });

  describe('removeFromWatchlist', () => {
    const userId = 1;
    const coinId = 'bitcoin';

    it('should remove item from watchlist successfully', async () => {
      mockPrismaService.watchlist.findUnique.mockResolvedValue(mockWatchlistItem);
      mockPrismaService.watchlist.delete.mockResolvedValue(mockWatchlistItem);

      const result = await service.removeFromWatchlist(userId, coinId);

      expect(result).toEqual(mockWatchlistItem);
      expect(mockPrismaService.watchlist.findUnique).toHaveBeenCalledWith({
        where: {
          userId_coinId: {
            userId: userId,
            coinId: coinId,
          },
        },
      });
      expect(mockPrismaService.watchlist.delete).toHaveBeenCalledWith({
        where: {
          userId_coinId: {
            userId: userId,
            coinId: coinId,
          },
        },
      });
    });

    it('should throw NotFoundException when item does not exist', async () => {
      mockPrismaService.watchlist.findUnique.mockResolvedValue(null);

      await expect(
        service.removeFromWatchlist(userId, coinId),
      ).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.watchlist.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.watchlist.delete).not.toHaveBeenCalled();

      // Test the specific error message
      await expect(
        service.removeFromWatchlist(userId, coinId),
      ).rejects.toThrow('在您的最愛列表中找不到此幣種');
    });

    it('should handle invalid userId', async () => {
      const invalidUserId = NaN;

      await expect(
        service.removeFromWatchlist(invalidUserId, coinId),
      ).rejects.toThrow('Invalid userId: must be a number');
    });

    it('should handle database errors during deletion', async () => {
      mockPrismaService.watchlist.findUnique.mockResolvedValue(mockWatchlistItem);
      const dbError = new Error('Database deletion failed');
      mockPrismaService.watchlist.delete.mockRejectedValue(dbError);

      await expect(
        service.removeFromWatchlist(userId, coinId),
      ).rejects.toThrow('Database deletion failed');
    });
  });

  describe('getUserWatchlist', () => {
    const userId = 1;
    const mockWatchlistItems = [mockWatchlistItem];

    it('should return watchlist with price data successfully', async () => {
      mockPrismaService.watchlist.findMany.mockResolvedValue(mockWatchlistItems);
      mockApiService.getCoinsMarkets.mockResolvedValue(mockMarketData);

      const result = await service.getUserWatchlist(userId);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: mockWatchlistItem.id,
        userId: mockWatchlistItem.userId,
        coinId: mockWatchlistItem.coinId,
        coinName: mockWatchlistItem.coinName,
        symbol: mockWatchlistItem.symbol,
        image: mockWatchlistItem.image,
        createdAt: mockWatchlistItem.createdAt,
        currentPrice: 50000,
        priceChange24h: 2.5,
        marketCap: 1000000000,
      });

      expect(mockPrismaService.watchlist.findMany).toHaveBeenCalledWith({
        where: { userId: userId },
      });
      expect(mockApiService.getCoinsMarkets).toHaveBeenCalledWith({
        ids: 'bitcoin',
        vs_currency: 'usd',
        per_page: 1,
        page: 1,
        order: 'market_cap_desc',
      });
    });

    it('should return empty array when no watchlist items exist', async () => {
      mockPrismaService.watchlist.findMany.mockResolvedValue([]);

      const result = await service.getUserWatchlist(userId);

      expect(result).toEqual([]);
      expect(mockPrismaService.watchlist.findMany).toHaveBeenCalledWith({
        where: { userId: userId },
      });
      expect(mockApiService.getCoinsMarkets).not.toHaveBeenCalled();
    });

    it('should return basic watchlist data when API fails', async () => {
      mockPrismaService.watchlist.findMany.mockResolvedValue(mockWatchlistItems);
      mockApiService.getCoinsMarkets.mockRejectedValue(new Error('API Error'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.getUserWatchlist(userId);

      expect(result).toEqual(mockWatchlistItems);
      expect(consoleErrorSpy).toHaveBeenCalledWith('獲取市場資料時發生錯誤:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should handle invalid userId', async () => {
      const invalidUserId = NaN;

      await expect(
        service.getUserWatchlist(invalidUserId),
      ).rejects.toThrow('Invalid userId: must be a number');
    });

    it('should handle multiple watchlist items', async () => {
      const multipleItems = [
        mockWatchlistItem,
        {
          ...mockWatchlistItem,
          id: 2,
          coinId: 'ethereum',
          coinName: 'Ethereum',
          symbol: 'ETH',
        },
      ];
      const multipleMarketData = [
        mockMarketData[0],
        {
          id: 'ethereum',
          current_price: 3000,
          price_change_percentage_24h: -1.5,
          market_cap: 500000000,
        },
      ];

      mockPrismaService.watchlist.findMany.mockResolvedValue(multipleItems);
      mockApiService.getCoinsMarkets.mockResolvedValue(multipleMarketData);

      const result = await service.getUserWatchlist(userId);

      expect(result).toHaveLength(2);
      expect(mockApiService.getCoinsMarkets).toHaveBeenCalledWith({
        ids: 'bitcoin,ethereum',
        vs_currency: 'usd',
        per_page: 2,
        page: 1,
        order: 'market_cap_desc',
      });
    });
  });

  describe('isInWatchlist', () => {
    const userId = 1;
    const coinId = 'bitcoin';

    it('should return true when item exists in watchlist', async () => {
      mockPrismaService.watchlist.findUnique.mockResolvedValue(mockWatchlistItem);

      const result = await service.isInWatchlist(userId, coinId);

      expect(result).toBe(true);
      expect(mockPrismaService.watchlist.findUnique).toHaveBeenCalledWith({
        where: {
          userId_coinId: {
            userId: userId,
            coinId: coinId,
          },
        },
      });
    });

    it('should return false when item does not exist in watchlist', async () => {
      mockPrismaService.watchlist.findUnique.mockResolvedValue(null);

      const result = await service.isInWatchlist(userId, coinId);

      expect(result).toBe(false);
    });

    it('should handle invalid userId', async () => {
      const invalidUserId = NaN;

      await expect(
        service.isInWatchlist(invalidUserId, coinId),
      ).rejects.toThrow('Invalid userId: must be a number');
    });
  });

  describe('checkBatchInWatchlist', () => {
    const userId = 1;
    const coinIds = ['bitcoin', 'ethereum', 'cardano'];

    it('should return correct batch check results', async () => {
      const mockWatchlistResults = [
        { coinId: 'bitcoin' },
        { coinId: 'cardano' },
      ];
      mockPrismaService.watchlist.findMany.mockResolvedValue(mockWatchlistResults);

      const result = await service.checkBatchInWatchlist(userId, coinIds);

      expect(result).toEqual({
        bitcoin: true,
        ethereum: false,
        cardano: true,
      });
      expect(mockPrismaService.watchlist.findMany).toHaveBeenCalledWith({
        where: {
          userId: userId,
          coinId: { in: coinIds },
        },
        select: {
          coinId: true,
        },
      });
    });

    it('should return all false when no items are in watchlist', async () => {
      mockPrismaService.watchlist.findMany.mockResolvedValue([]);

      const result = await service.checkBatchInWatchlist(userId, coinIds);

      expect(result).toEqual({
        bitcoin: false,
        ethereum: false,
        cardano: false,
      });
    });

    it('should handle empty coinIds array', async () => {
      const result = await service.checkBatchInWatchlist(userId, []);

      expect(result).toEqual({});
      expect(mockPrismaService.watchlist.findMany).toHaveBeenCalledWith({
        where: {
          userId: userId,
          coinId: { in: [] },
        },
        select: {
          coinId: true,
        },
      });
    });

    it('should handle invalid userId', async () => {
      const invalidUserId = NaN;

      await expect(
        service.checkBatchInWatchlist(invalidUserId, coinIds),
      ).rejects.toThrow('Invalid userId: must be a number');
    });
  });

  describe('getWatchlistCount', () => {
    const userId = 1;

    it('should return correct watchlist count', async () => {
      const expectedCount = 5;
      mockPrismaService.watchlist.count.mockResolvedValue(expectedCount);

      const result = await service.getWatchlistCount(userId);

      expect(result).toBe(expectedCount);
      expect(mockPrismaService.watchlist.count).toHaveBeenCalledWith({
        where: { userId: userId },
      });
    });

    it('should return zero when no items in watchlist', async () => {
      mockPrismaService.watchlist.count.mockResolvedValue(0);

      const result = await service.getWatchlistCount(userId);

      expect(result).toBe(0);
    });

    it('should handle invalid userId', async () => {
      const invalidUserId = NaN;

      await expect(
        service.getWatchlistCount(invalidUserId),
      ).rejects.toThrow('Invalid userId: must be a number');
    });

    it('should handle database errors during count', async () => {
      const dbError = new Error('Database count failed');
      mockPrismaService.watchlist.count.mockRejectedValue(dbError);

      await expect(
        service.getWatchlistCount(userId),
      ).rejects.toThrow('Database count failed');
    });
  });

  describe('integration scenarios', () => {
    const userId = 1;

    it('should handle complete watchlist workflow', async () => {
      // Add to watchlist
      mockPrismaService.watchlist.findUnique.mockResolvedValue(null);
      mockPrismaService.watchlist.create.mockResolvedValue(mockWatchlistItem);

      await service.addToWatchlist(userId, mockCreateWatchlistDto);

      // Check if in watchlist
      mockPrismaService.watchlist.findUnique.mockResolvedValue(mockWatchlistItem);
      const isInWatchlist = await service.isInWatchlist(userId, 'bitcoin');
      expect(isInWatchlist).toBe(true);

      // Get watchlist count
      mockPrismaService.watchlist.count.mockResolvedValue(1);
      const count = await service.getWatchlistCount(userId);
      expect(count).toBe(1);

      // Remove from watchlist
      mockPrismaService.watchlist.delete.mockResolvedValue(mockWatchlistItem);
      await service.removeFromWatchlist(userId, 'bitcoin');
    });

    it('should handle API integration with price data', async () => {
      mockPrismaService.watchlist.findMany.mockResolvedValue([mockWatchlistItem]);
      mockApiService.getCoinsMarkets.mockResolvedValue(mockMarketData);

      const watchlist = await service.getUserWatchlist(userId);

      expect(watchlist[0]).toHaveProperty('currentPrice');
      expect(watchlist[0]).toHaveProperty('priceChange24h');
      expect(watchlist[0]).toHaveProperty('marketCap');
    });
  });

  describe('error handling edge cases', () => {
    it('should handle Prisma connection errors', async () => {
      const connectionError = new Error('Prisma connection failed');
      mockPrismaService.watchlist.findMany.mockRejectedValue(connectionError);

      await expect(service.getUserWatchlist(1)).rejects.toThrow('Prisma connection failed');
    });

    it('should handle API service timeout', async () => {
      mockPrismaService.watchlist.findMany.mockResolvedValue([mockWatchlistItem]);
      const timeoutError = new Error('Request timeout');
      mockApiService.getCoinsMarkets.mockRejectedValue(timeoutError);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.getUserWatchlist(1);

      expect(result).toEqual([mockWatchlistItem]);
      expect(consoleErrorSpy).toHaveBeenCalledWith('獲取市場資料時發生錯誤:', timeoutError);

      consoleErrorSpy.mockRestore();
    });
  });
});
