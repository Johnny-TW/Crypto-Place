import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

describe('ApiController', () => {
  let controller: ApiController;
  let apiService: ApiService;

  const mockApiService = {
    getCoinsMarkets: jest.fn(),
    getCoinById: jest.fn(),
    getNftsList: jest.fn(),
    getNftById: jest.fn(),
    getBitcoinMarketChart: jest.fn(),
    getNews: jest.fn(),
    getCryptoDetails: jest.fn(),
    getCryptoDetailsChart: jest.fn(),
    getCryptoMarketList: jest.fn(),
    getExchangeById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        {
          provide: ApiService,
          useValue: mockApiService,
        },
      ],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    apiService = module.get<ApiService>(ApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCoinsMarkets', () => {
    it('should return coins markets data', async () => {
      const mockQuery = { vs_currency: 'usd', per_page: 100 };
      const mockResult = [
        { id: 'bitcoin', name: 'Bitcoin', current_price: 50000 },
        { id: 'ethereum', name: 'Ethereum', current_price: 3000 },
      ];

      mockApiService.getCoinsMarkets.mockResolvedValue(mockResult);

      const result = await controller.getCoinsMarkets(mockQuery);

      expect(result).toEqual(mockResult);
      expect(apiService.getCoinsMarkets).toHaveBeenCalledWith(mockQuery);
      expect(apiService.getCoinsMarkets).toHaveBeenCalledTimes(1);
    });

    it('should handle empty query object', async () => {
      const mockResult = [{ id: 'bitcoin', name: 'Bitcoin' }];
      mockApiService.getCoinsMarkets.mockResolvedValue(mockResult);

      const result = await controller.getCoinsMarkets({});

      expect(result).toEqual(mockResult);
      expect(apiService.getCoinsMarkets).toHaveBeenCalledWith({});
    });

    it('should propagate service errors', async () => {
      const mockError = new HttpException('API Error', HttpStatus.BAD_REQUEST);
      mockApiService.getCoinsMarkets.mockRejectedValue(mockError);

      await expect(controller.getCoinsMarkets({})).rejects.toThrow(mockError);
    });
  });

  describe('getCoinById', () => {
    it('should return coin data by ID', async () => {
      const mockCoinData = {
        id: 'bitcoin',
        name: 'Bitcoin',
        current_price: { usd: 50000 },
      };

      mockApiService.getCoinById.mockResolvedValue(mockCoinData);

      const result = await controller.getCoinById('bitcoin');

      expect(result).toEqual(mockCoinData);
      expect(apiService.getCoinById).toHaveBeenCalledWith('bitcoin');
      expect(apiService.getCoinById).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid coin ID', async () => {
      const mockError = new HttpException(
        'Coin not found',
        HttpStatus.NOT_FOUND,
      );
      mockApiService.getCoinById.mockRejectedValue(mockError);

      await expect(controller.getCoinById('invalid-coin')).rejects.toThrow(
        mockError,
      );
    });
  });

  describe('getNftsList', () => {
    it('should return NFTs list', async () => {
      const mockQuery = { order: 'market_cap_usd_desc' };
      const mockNftData = [
        { id: 'cryptopunks', name: 'CryptoPunks' },
        { id: 'bored-ape-yacht-club', name: 'Bored Ape Yacht Club' },
      ];

      mockApiService.getNftsList.mockResolvedValue(mockNftData);

      const result = await controller.getNftsList(mockQuery);

      expect(result).toEqual(mockNftData);
      expect(apiService.getNftsList).toHaveBeenCalledWith(mockQuery);
      expect(apiService.getNftsList).toHaveBeenCalledTimes(1);
    });

    it('should handle empty query for NFTs list', async () => {
      const mockNftData = [{ id: 'cryptopunks', name: 'CryptoPunks' }];
      mockApiService.getNftsList.mockResolvedValue(mockNftData);

      const result = await controller.getNftsList({});

      expect(result).toEqual(mockNftData);
      expect(apiService.getNftsList).toHaveBeenCalledWith({});
    });
  });

  describe('getNftById', () => {
    it('should return NFT data by ID', async () => {
      const mockNftData = {
        id: 'cryptopunks',
        name: 'CryptoPunks',
        description: 'The original NFT collection',
      };

      mockApiService.getNftById.mockResolvedValue(mockNftData);

      const result = await controller.getNftById('cryptopunks');

      expect(result).toEqual(mockNftData);
      expect(apiService.getNftById).toHaveBeenCalledWith('cryptopunks');
      expect(apiService.getNftById).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid NFT ID', async () => {
      const mockError = new HttpException(
        'NFT not found',
        HttpStatus.NOT_FOUND,
      );
      mockApiService.getNftById.mockRejectedValue(mockError);

      await expect(controller.getNftById('invalid-nft')).rejects.toThrow(
        mockError,
      );
    });
  });

  describe('getBitcoinMarketChart', () => {
    it('should return Bitcoin market chart data', async () => {
      const mockQuery = { vs_currency: 'usd', days: '30' };
      const mockChartData = {
        prices: [[1623456000000, 50000]],
        market_caps: [[1623456000000, 900000000000]],
        total_volumes: [[1623456000000, 50000000000]],
      };

      mockApiService.getBitcoinMarketChart.mockResolvedValue(mockChartData);

      const result = await controller.getBitcoinMarketChart(mockQuery);

      expect(result).toEqual(mockChartData);
      expect(apiService.getBitcoinMarketChart).toHaveBeenCalledWith(mockQuery);
      expect(apiService.getBitcoinMarketChart).toHaveBeenCalledTimes(1);
    });

    it('should handle empty query for Bitcoin chart', async () => {
      const mockChartData = { prices: [] };
      mockApiService.getBitcoinMarketChart.mockResolvedValue(mockChartData);

      const result = await controller.getBitcoinMarketChart({});

      expect(result).toEqual(mockChartData);
      expect(apiService.getBitcoinMarketChart).toHaveBeenCalledWith({});
    });
  });

  describe('getNews', () => {
    it('should return crypto news', async () => {
      const mockQuery = { lang: 'EN', limit: 4 };
      const mockNewsData = {
        Data: [
          {
            id: '1',
            title: 'Bitcoin News',
            body: 'Bitcoin price update',
          },
        ],
      };

      mockApiService.getNews.mockResolvedValue(mockNewsData);

      const result = await controller.getNews(mockQuery);

      expect(result).toEqual(mockNewsData);
      expect(apiService.getNews).toHaveBeenCalledWith(mockQuery);
      expect(apiService.getNews).toHaveBeenCalledTimes(1);
    });

    it('should handle news API errors', async () => {
      const mockError = new HttpException(
        'News API Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      mockApiService.getNews.mockRejectedValue(mockError);

      await expect(controller.getNews({})).rejects.toThrow(mockError);
    });
  });

  describe('getCryptoDetails', () => {
    it('should return crypto details', async () => {
      const mockQuery = { ids: 'bitcoin,ethereum' };
      const mockDetailsData = [
        { id: 'bitcoin', name: 'Bitcoin' },
        { id: 'ethereum', name: 'Ethereum' },
      ];

      mockApiService.getCryptoDetails.mockResolvedValue(mockDetailsData);

      const result = await controller.getCryptoDetails(mockQuery);

      expect(result).toEqual(mockDetailsData);
      expect(apiService.getCryptoDetails).toHaveBeenCalledWith(mockQuery);
      expect(apiService.getCryptoDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCryptoDetailsChart', () => {
    it('should return Bitcoin detailed chart data', async () => {
      const mockQuery = { vs_currency: 'usd', days: '7' };
      const mockChartData = {
        prices: [[1623456000000, 50000]],
        market_caps: [[1623456000000, 900000000000]],
      };

      mockApiService.getCryptoDetailsChart.mockResolvedValue(
        mockChartData,
      );

      const result = await controller.getCryptoDetailsChart('bitcoin', mockQuery);

      expect(result).toEqual(mockChartData);
      expect(apiService.getCryptoDetailsChart).toHaveBeenCalledWith(
        'bitcoin',
        mockQuery,
      );
      expect(apiService.getCryptoDetailsChart).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCryptoMarketList', () => {
    it('should return crypto exchanges list', async () => {
      const mockExchangesData = [
        { id: 'binance', name: 'Binance' },
        { id: 'coinbase-pro', name: 'Coinbase Pro' },
      ];

      mockApiService.getCryptoMarketList.mockResolvedValue(mockExchangesData);

      const result = await controller.getCryptoMarketList();

      expect(result).toEqual(mockExchangesData);
      expect(apiService.getCryptoMarketList).toHaveBeenCalledTimes(1);
    });

    it('should handle market list API errors', async () => {
      const mockError = new HttpException(
        'Market API Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      mockApiService.getCryptoMarketList.mockRejectedValue(mockError);

      await expect(controller.getCryptoMarketList()).rejects.toThrow(mockError);
    });
  });

  describe('getExchangeById', () => {
    it('should return exchange data by ID', async () => {
      const mockExchangeData = {
        id: 'binance',
        name: 'Binance',
        year_established: 2017,
        country: 'Cayman Islands',
      };

      mockApiService.getExchangeById.mockResolvedValue(mockExchangeData);

      const result = await controller.getExchangeById('binance');

      expect(result).toEqual(mockExchangeData);
      expect(apiService.getExchangeById).toHaveBeenCalledWith('binance');
      expect(apiService.getExchangeById).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid exchange ID', async () => {
      const mockError = new HttpException(
        'Exchange not found',
        HttpStatus.NOT_FOUND,
      );
      mockApiService.getExchangeById.mockRejectedValue(mockError);

      await expect(
        controller.getExchangeById('invalid-exchange'),
      ).rejects.toThrow(mockError);
    });
  });
});
