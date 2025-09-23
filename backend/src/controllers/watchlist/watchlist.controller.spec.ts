import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { WatchlistWithPriceDto } from './dto/watchlist-response.dto';

describe('WatchlistController', () => {
  let controller: WatchlistController;
  let watchlistService: WatchlistService;

  const mockWatchlistService = {
    addToWatchlist: jest.fn(),
    removeFromWatchlist: jest.fn(),
    getUserWatchlist: jest.fn(),
    isInWatchlist: jest.fn(),
    checkBatchInWatchlist: jest.fn(),
    getWatchlistCount: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: '1',
    },
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

  const mockWatchlistWithPrice: WatchlistWithPriceDto = {
    ...mockWatchlistItem,
    currentPrice: 50000,
    priceChange24h: 2.5,
    marketCap: 1000000000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchlistController],
      providers: [
        {
          provide: WatchlistService,
          useValue: mockWatchlistService,
        },
      ],
    }).compile();

    controller = module.get<WatchlistController>(WatchlistController);
    watchlistService = module.get<WatchlistService>(WatchlistService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToWatchlist', () => {
    it('should add item to watchlist successfully', async () => {
      mockWatchlistService.addToWatchlist.mockResolvedValue(mockWatchlistItem);

      const result = await controller.addToWatchlist(mockRequest, mockCreateWatchlistDto);

      expect(result).toEqual(mockWatchlistItem);
      expect(mockWatchlistService.addToWatchlist).toHaveBeenCalledWith(
        1,
        mockCreateWatchlistDto,
      );
      expect(mockWatchlistService.addToWatchlist).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when item already exists', async () => {
      mockWatchlistService.addToWatchlist.mockRejectedValue(
        new ConflictException('此幣種已在您的最愛列表中'),
      );

      await expect(
        controller.addToWatchlist(mockRequest, mockCreateWatchlistDto),
      ).rejects.toThrow(ConflictException);
      await expect(
        controller.addToWatchlist(mockRequest, mockCreateWatchlistDto),
      ).rejects.toThrow('此幣種已在您的最愛列表中');
    });

    it('should handle invalid userId in request', async () => {
      const invalidRequest = { user: { id: 'invalid' } };

      await expect(
        controller.addToWatchlist(invalidRequest, mockCreateWatchlistDto),
      ).rejects.toThrow('Invalid userId in request: must be a number');
    });

    it('should handle missing userId in request', async () => {
      const invalidRequest = { user: {} };

      await expect(
        controller.addToWatchlist(invalidRequest, mockCreateWatchlistDto),
      ).rejects.toThrow('Invalid userId in request: must be a number');
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Database connection failed');
      mockWatchlistService.addToWatchlist.mockRejectedValue(serviceError);

      await expect(
        controller.addToWatchlist(mockRequest, mockCreateWatchlistDto),
      ).rejects.toThrow('Database connection failed');
    });

    it('should convert string userId to number correctly', async () => {
      const stringIdRequest = { user: { id: '42' } };
      mockWatchlistService.addToWatchlist.mockResolvedValue(mockWatchlistItem);

      await controller.addToWatchlist(stringIdRequest, mockCreateWatchlistDto);

      expect(mockWatchlistService.addToWatchlist).toHaveBeenCalledWith(
        42,
        mockCreateWatchlistDto,
      );
    });
  });

  describe('removeFromWatchlist', () => {
    const coinId = 'bitcoin';

    it('should remove item from watchlist successfully', async () => {
      mockWatchlistService.removeFromWatchlist.mockResolvedValue(mockWatchlistItem);

      const result = await controller.removeFromWatchlist(mockRequest, coinId);

      expect(result).toEqual(mockWatchlistItem);
      expect(mockWatchlistService.removeFromWatchlist).toHaveBeenCalledWith(1, coinId);
      expect(mockWatchlistService.removeFromWatchlist).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when item does not exist', async () => {
      mockWatchlistService.removeFromWatchlist.mockRejectedValue(
        new NotFoundException('在您的最愛列表中找不到此幣種'),
      );

      await expect(
        controller.removeFromWatchlist(mockRequest, coinId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        controller.removeFromWatchlist(mockRequest, coinId),
      ).rejects.toThrow('在您的最愛列表中找不到此幣種');
    });

    it('should handle invalid userId in request', async () => {
      const invalidRequest = { user: { id: 'invalid' } };

      await expect(
        controller.removeFromWatchlist(invalidRequest, coinId),
      ).rejects.toThrow('Invalid userId in request: must be a number');
    });

    it('should handle different coin IDs', async () => {
      const differentCoinId = 'ethereum';
      mockWatchlistService.removeFromWatchlist.mockResolvedValue(mockWatchlistItem);

      await controller.removeFromWatchlist(mockRequest, differentCoinId);

      expect(mockWatchlistService.removeFromWatchlist).toHaveBeenCalledWith(
        1,
        differentCoinId,
      );
    });
  });

  describe('getUserWatchlist', () => {
    it('should return user watchlist with price data', async () => {
      const mockWatchlistArray = [mockWatchlistWithPrice];
      mockWatchlistService.getUserWatchlist.mockResolvedValue(mockWatchlistArray);

      const result = await controller.getUserWatchlist(mockRequest);

      expect(result).toEqual(mockWatchlistArray);
      expect(mockWatchlistService.getUserWatchlist).toHaveBeenCalledWith(1);
      expect(mockWatchlistService.getUserWatchlist).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no items in watchlist', async () => {
      mockWatchlistService.getUserWatchlist.mockResolvedValue([]);

      const result = await controller.getUserWatchlist(mockRequest);

      expect(result).toEqual([]);
    });

    it('should handle invalid userId in request', async () => {
      const invalidRequest = { user: { id: 'invalid' } };

      await expect(
        controller.getUserWatchlist(invalidRequest),
      ).rejects.toThrow('Invalid userId in request: must be a number');
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('API service unavailable');
      mockWatchlistService.getUserWatchlist.mockRejectedValue(serviceError);

      await expect(
        controller.getUserWatchlist(mockRequest),
      ).rejects.toThrow('API service unavailable');
    });

    it('should handle multiple watchlist items', async () => {
      const multipleItems = [
        mockWatchlistWithPrice,
        { ...mockWatchlistWithPrice, id: 2, coinId: 'ethereum' },
      ];
      mockWatchlistService.getUserWatchlist.mockResolvedValue(multipleItems);

      const result = await controller.getUserWatchlist(mockRequest);

      expect(result).toHaveLength(2);
      expect(result).toEqual(multipleItems);
    });
  });

  describe('checkIsInWatchlist', () => {
    const coinId = 'bitcoin';

    it('should return true when coin is in watchlist', async () => {
      mockWatchlistService.isInWatchlist.mockResolvedValue(true);

      const result = await controller.checkIsInWatchlist(mockRequest, coinId);

      expect(result).toEqual({ isInWatchlist: true });
      expect(mockWatchlistService.isInWatchlist).toHaveBeenCalledWith(1, coinId);
      expect(mockWatchlistService.isInWatchlist).toHaveBeenCalledTimes(1);
    });

    it('should return false when coin is not in watchlist', async () => {
      mockWatchlistService.isInWatchlist.mockResolvedValue(false);

      const result = await controller.checkIsInWatchlist(mockRequest, coinId);

      expect(result).toEqual({ isInWatchlist: false });
    });

    it('should handle invalid userId in request', async () => {
      const invalidRequest = { user: { id: 'invalid' } };

      await expect(
        controller.checkIsInWatchlist(invalidRequest, coinId),
      ).rejects.toThrow('Invalid userId in request: must be a number');
    });

    it('should handle different coin IDs', async () => {
      const differentCoinId = 'ethereum';
      mockWatchlistService.isInWatchlist.mockResolvedValue(false);

      const result = await controller.checkIsInWatchlist(mockRequest, differentCoinId);

      expect(result).toEqual({ isInWatchlist: false });
      expect(mockWatchlistService.isInWatchlist).toHaveBeenCalledWith(1, differentCoinId);
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Database query failed');
      mockWatchlistService.isInWatchlist.mockRejectedValue(serviceError);

      await expect(
        controller.checkIsInWatchlist(mockRequest, coinId),
      ).rejects.toThrow('Database query failed');
    });
  });

  describe('checkBatchInWatchlist', () => {
    const mockCoinIds = ['bitcoin', 'ethereum', 'cardano'];
    const mockBatchResult = {
      bitcoin: true,
      ethereum: false,
      cardano: true,
    };

    it('should return batch check results successfully', async () => {
      mockWatchlistService.checkBatchInWatchlist.mockResolvedValue(mockBatchResult);

      const result = await controller.checkBatchInWatchlist(mockRequest, {
        coinIds: mockCoinIds,
      });

      expect(result).toEqual(mockBatchResult);
      expect(mockWatchlistService.checkBatchInWatchlist).toHaveBeenCalledWith(
        1,
        mockCoinIds,
      );
      expect(mockWatchlistService.checkBatchInWatchlist).toHaveBeenCalledTimes(1);
    });

    it('should return empty object when coinIds array is empty', async () => {
      const result = await controller.checkBatchInWatchlist(mockRequest, {
        coinIds: [],
      });

      expect(result).toEqual({});
      expect(mockWatchlistService.checkBatchInWatchlist).not.toHaveBeenCalled();
    });

    it('should handle invalid coinIds parameter', async () => {
      const result = await controller.checkBatchInWatchlist(mockRequest, {
        coinIds: null as any,
      });

      expect(result).toEqual({});
      expect(mockWatchlistService.checkBatchInWatchlist).not.toHaveBeenCalled();
    });

    it('should handle invalid userId in request', async () => {
      const invalidRequest = { user: { id: 'invalid' } };

      await expect(
        controller.checkBatchInWatchlist(invalidRequest, { coinIds: mockCoinIds }),
      ).rejects.toThrow('Invalid userId in request: must be a number');
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Batch query failed');
      mockWatchlistService.checkBatchInWatchlist.mockRejectedValue(serviceError);

      await expect(
        controller.checkBatchInWatchlist(mockRequest, { coinIds: mockCoinIds }),
      ).rejects.toThrow('Batch query failed');
    });

    it('should handle single coin ID in array', async () => {
      const singleCoinId = ['bitcoin'];
      const singleResult = { bitcoin: true };
      mockWatchlistService.checkBatchInWatchlist.mockResolvedValue(singleResult);

      const result = await controller.checkBatchInWatchlist(mockRequest, {
        coinIds: singleCoinId,
      });

      expect(result).toEqual(singleResult);
    });
  });

  describe('getWatchlistCount', () => {
    it('should return watchlist count successfully', async () => {
      const expectedCount = 5;
      mockWatchlistService.getWatchlistCount.mockResolvedValue(expectedCount);

      const result = await controller.getWatchlistCount(mockRequest);

      expect(result).toEqual({ count: expectedCount });
      expect(mockWatchlistService.getWatchlistCount).toHaveBeenCalledWith(1);
      expect(mockWatchlistService.getWatchlistCount).toHaveBeenCalledTimes(1);
    });

    it('should return zero count when watchlist is empty', async () => {
      mockWatchlistService.getWatchlistCount.mockResolvedValue(0);

      const result = await controller.getWatchlistCount(mockRequest);

      expect(result).toEqual({ count: 0 });
    });

    it('should handle invalid userId in request', async () => {
      const invalidRequest = { user: { id: 'invalid' } };

      await expect(
        controller.getWatchlistCount(invalidRequest),
      ).rejects.toThrow('Invalid userId in request: must be a number');
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Count query failed');
      mockWatchlistService.getWatchlistCount.mockRejectedValue(serviceError);

      await expect(
        controller.getWatchlistCount(mockRequest),
      ).rejects.toThrow('Count query failed');
    });

    it('should handle large count numbers', async () => {
      const largeCount = 999999;
      mockWatchlistService.getWatchlistCount.mockResolvedValue(largeCount);

      const result = await controller.getWatchlistCount(mockRequest);

      expect(result).toEqual({ count: largeCount });
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete watchlist workflow', async () => {
      // Add to watchlist
      mockWatchlistService.addToWatchlist.mockResolvedValue(mockWatchlistItem);
      await controller.addToWatchlist(mockRequest, mockCreateWatchlistDto);

      // Check if in watchlist
      mockWatchlistService.isInWatchlist.mockResolvedValue(true);
      const checkResult = await controller.checkIsInWatchlist(mockRequest, 'bitcoin');
      expect(checkResult.isInWatchlist).toBe(true);

      // Get watchlist
      mockWatchlistService.getUserWatchlist.mockResolvedValue([mockWatchlistWithPrice]);
      const watchlist = await controller.getUserWatchlist(mockRequest);
      expect(watchlist).toHaveLength(1);

      // Get count
      mockWatchlistService.getWatchlistCount.mockResolvedValue(1);
      const countResult = await controller.getWatchlistCount(mockRequest);
      expect(countResult.count).toBe(1);

      // Remove from watchlist
      mockWatchlistService.removeFromWatchlist.mockResolvedValue(mockWatchlistItem);
      await controller.removeFromWatchlist(mockRequest, 'bitcoin');
    });

    it('should handle batch operations correctly', async () => {
      const coinIds = ['bitcoin', 'ethereum', 'cardano'];
      const batchResult = {
        bitcoin: true,
        ethereum: false,
        cardano: true,
      };

      mockWatchlistService.checkBatchInWatchlist.mockResolvedValue(batchResult);

      const result = await controller.checkBatchInWatchlist(mockRequest, { coinIds });

      expect(result).toEqual(batchResult);
      expect(Object.keys(result)).toHaveLength(3);
    });
  });

  describe('error handling edge cases', () => {
    it('should handle malformed request objects', async () => {
      const malformedRequest = {};

      await expect(
        controller.addToWatchlist(malformedRequest as any, mockCreateWatchlistDto),
      ).rejects.toThrow('Invalid userId in request: must be a number');
    });

    it('should handle numeric userId as string correctly', async () => {
      const numericStringRequest = { user: { id: '123' } };
      mockWatchlistService.addToWatchlist.mockResolvedValue(mockWatchlistItem);

      await controller.addToWatchlist(numericStringRequest, mockCreateWatchlistDto);

      expect(mockWatchlistService.addToWatchlist).toHaveBeenCalledWith(
        123,
        mockCreateWatchlistDto,
      );
    });

    it('should handle service timeout errors gracefully', async () => {
      const timeoutError = new Error('Request timeout');
      mockWatchlistService.getUserWatchlist.mockRejectedValue(timeoutError);

      await expect(
        controller.getUserWatchlist(mockRequest),
      ).rejects.toThrow('Request timeout');
    });

    it('should handle concurrent requests appropriately', async () => {
      mockWatchlistService.addToWatchlist.mockResolvedValue(mockWatchlistItem);
      mockWatchlistService.getUserWatchlist.mockResolvedValue([mockWatchlistWithPrice]);

      // Simulate concurrent requests
      const promises = [
        controller.addToWatchlist(mockRequest, mockCreateWatchlistDto),
        controller.getUserWatchlist(mockRequest),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(mockWatchlistItem);
      expect(results[1]).toEqual([mockWatchlistWithPrice]);
    });
  });
});