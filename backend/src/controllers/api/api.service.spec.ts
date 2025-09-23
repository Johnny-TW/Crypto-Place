import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpService: HttpService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;

  const mockHttpService = {
    get: jest.fn(),
    axiosRef: {
      get: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        coingeckoApiUrl: 'https://api.coingecko.com/api/v3',
        cryptocompareApiUrl: 'https://min-api.cryptocompare.com',
        apiKey: 'test-api-key',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ApiService>(ApiService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCoinById', () => {
    it('should return coin data successfully', async () => {
      const mockCoinData = {
        id: 'bitcoin',
        name: 'Bitcoin',
        current_price: { usd: 50000 },
      };

      mockHttpService.axiosRef.get.mockResolvedValue({
        data: mockCoinData,
      });

      const result = await service.getCoinById('bitcoin');

      expect(result).toEqual(mockCoinData);
      expect(mockHttpService.axiosRef.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/bitcoin',
        {
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': process.env.API_KEY,
          },
        },
      );
    });

    it('should throw HttpException when API call fails', async () => {
      const mockError = {
        message: 'Network Error',
        response: { status: 404 },
      };

      mockHttpService.axiosRef.get.mockRejectedValue(mockError);

      await expect(service.getCoinById('invalid-coin')).rejects.toThrow(
        HttpException,
      );
      await expect(service.getCoinById('invalid-coin')).rejects.toThrow(
        'Error fetching coin data for invalid-coin: Network Error',
      );
    });

    it('should handle error without response status', async () => {
      const mockError = {
        message: 'Network Error',
      };

      mockHttpService.axiosRef.get.mockRejectedValue(mockError);

      await expect(service.getCoinById('bitcoin')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getCoinsMarkets', () => {
    it('should return markets data with default parameters', async () => {
      const mockMarketData = [
        { id: 'bitcoin', name: 'Bitcoin', current_price: 50000 },
        { id: 'ethereum', name: 'Ethereum', current_price: 3000 },
      ];

      const mockAxiosResponse: AxiosResponse = {
        data: mockMarketData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      mockHttpService.get.mockReturnValue(of(mockAxiosResponse));

      const result = await service.getCoinsMarkets({});

      expect(result).toEqual(mockMarketData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
          },
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'test-api-key',
          },
        },
      );
    });

    it('should use custom query parameters', async () => {
      const mockMarketData = [{ id: 'bitcoin', name: 'Bitcoin' }];
      const mockAxiosResponse: AxiosResponse = {
        data: mockMarketData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      mockHttpService.get.mockReturnValue(of(mockAxiosResponse));

      const customQuery = {
        vs_currency: 'eur',
        per_page: 50,
        page: 2,
      };

      await service.getCoinsMarkets(customQuery);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'eur',
            order: 'market_cap_desc',
            per_page: 50,
            page: 2,
          },
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'test-api-key',
          },
        },
      );
    });

    it('should throw HttpException when API call fails', async () => {
      const mockError = {
        message: 'API Error',
        response: { status: 500 },
      };

      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getCoinsMarkets({})).rejects.toThrow(HttpException);
    });
  });

  describe('getNftsList', () => {
    it('should return NFTs list with default parameters', async () => {
      const mockNftData = [
        { id: 'cryptopunks', name: 'CryptoPunks' },
        { id: 'bored-ape-yacht-club', name: 'Bored Ape Yacht Club' },
      ];

      const mockAxiosResponse: AxiosResponse = {
        data: mockNftData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      mockHttpService.get.mockReturnValue(of(mockAxiosResponse));

      const result = await service.getNftsList();

      expect(result).toEqual(mockNftData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/nfts/list',
        {
          params: {
            order: 'market_cap_usd_desc',
          },
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'test-api-key',
          },
        },
      );
    });

    it('should handle custom query parameters', async () => {
      const mockNftData = [{ id: 'cryptopunks', name: 'CryptoPunks' }];
      const mockAxiosResponse: AxiosResponse = {
        data: mockNftData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      mockHttpService.get.mockReturnValue(of(mockAxiosResponse));

      const customQuery = { order: 'h24_volume_usd_desc' };

      await service.getNftsList(customQuery);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/nfts/list',
        {
          params: {
            order: 'h24_volume_usd_desc',
          },
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'test-api-key',
          },
        },
      );
    });
  });

  describe('getNftById', () => {
    it('should return NFT data by ID', async () => {
      const mockNftData = {
        id: 'cryptopunks',
        name: 'CryptoPunks',
        description: 'CryptoPunks description',
      };

      const mockAxiosResponse: AxiosResponse = {
        data: mockNftData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      mockHttpService.get.mockReturnValue(of(mockAxiosResponse));

      const result = await service.getNftById('cryptopunks');

      expect(result).toEqual(mockNftData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/nfts/cryptopunks',
        {
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'test-api-key',
          },
        },
      );
    });

    it('should throw HttpException when NFT not found', async () => {
      const mockError = {
        message: 'Not Found',
        response: { status: 404 },
      };

      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getNftById('invalid-nft')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getBitcoinMarketChart', () => {
    it('should return Bitcoin market chart data', async () => {
      const mockChartData = {
        prices: [[1623456000000, 50000]],
        market_caps: [[1623456000000, 900000000000]],
        total_volumes: [[1623456000000, 50000000000]],
      };

      const mockAxiosResponse: AxiosResponse = {
        data: mockChartData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      mockHttpService.get.mockReturnValue(of(mockAxiosResponse));

      const query = { vs_currency: 'usd', days: '30' };
      const result = await service.getBitcoinMarketChart(query);

      expect(result).toEqual(mockChartData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
        {
          params: query,
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'test-api-key',
          },
        },
      );
    });
  });

  describe('getNews', () => {
    it('should return crypto news', async () => {
      const mockNewsData = {
        Data: [
          {
            id: '1',
            title: 'Bitcoin News',
            body: 'Bitcoin price update',
          },
        ],
      };

      const mockAxiosResponse: AxiosResponse = {
        data: mockNewsData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      mockHttpService.get.mockReturnValue(of(mockAxiosResponse));

      const query = { lang: 'EN', limit: 4 };
      const result = await service.getNews(query);

      expect(result).toEqual(mockNewsData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://min-api.cryptocompare.com/news/v1/article/list',
        {
          params: query,
        },
      );
    });

    it('should throw HttpException when news API fails', async () => {
      const mockError = {
        message: 'News API Error',
        response: { status: 500 },
      };

      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getNews({})).rejects.toThrow(HttpException);
    });
  });

  describe('getCryptoMarketList', () => {
    it('should return crypto exchanges list', async () => {
      const mockExchangesData = [
        { id: 'binance', name: 'Binance' },
        { id: 'coinbase-pro', name: 'Coinbase Pro' },
      ];

      const mockAxiosResponse: AxiosResponse = {
        data: mockExchangesData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      mockHttpService.get.mockReturnValue(of(mockAxiosResponse));

      const result = await service.getCryptoMarketList();

      expect(result).toEqual(mockExchangesData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/exchanges',
        {
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'test-api-key',
          },
        },
      );
    });
  });

  describe('getExchangeById', () => {
    it('should return exchange data by ID', async () => {
      const mockExchangeData = {
        id: 'binance',
        name: 'Binance',
        year_established: 2017,
      };

      const mockAxiosResponse: AxiosResponse = {
        data: mockExchangeData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      mockHttpService.get.mockReturnValue(of(mockAxiosResponse));

      const result = await service.getExchangeById('binance');

      expect(result).toEqual(mockExchangeData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/exchanges/binance',
        {
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'test-api-key',
          },
        },
      );
    });

    it('should throw HttpException when exchange not found', async () => {
      const mockError = {
        message: 'Exchange not found',
        response: { status: 404 },
      };

      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getExchangeById('invalid-exchange')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getCryptoDetails', () => {
    it('should return crypto details data', async () => {
      const mockDetailsData = [
        { id: 'bitcoin', name: 'Bitcoin' },
        { id: 'ethereum', name: 'Ethereum' },
      ];

      const mockAxiosResponse: AxiosResponse = {
        data: mockDetailsData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      mockHttpService.get.mockReturnValue(of(mockAxiosResponse));

      const query = { ids: 'bitcoin,ethereum' };
      const result = await service.getCryptoDetails(query);

      expect(result).toEqual(mockDetailsData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins',
        {
          params: query,
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'test-api-key',
          },
        },
      );
    });

    it('should throw HttpException when API call fails', async () => {
      const mockError = {
        message: 'API Error',
        response: { status: 500 },
      };

      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getCryptoDetails({})).rejects.toThrow(HttpException);
    });
  });

  describe('getCryptoDetailsChart', () => {
    it('should return Bitcoin detailed chart data', async () => {
      const mockChartData = {
        prices: [[1623456000000, 50000]],
        market_caps: [[1623456000000, 900000000000]],
      };

      const mockAxiosResponse: AxiosResponse = {
        data: mockChartData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      mockHttpService.get.mockReturnValue(of(mockAxiosResponse));

      const query = { vs_currency: 'usd', days: '7' };
      const result = await service.getCryptoDetailsChart('bitcoin', query);

      expect(result).toEqual(mockChartData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
        {
          params: query,
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'test-api-key',
          },
        },
      );
    });

    it('should throw HttpException when API call fails', async () => {
      const mockError = {
        message: 'Chart API Error',
        response: { status: 500 },
      };

      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getCryptoDetailsChart('bitcoin', {})).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('error handling edge cases', () => {
    it('should handle axios errors with different status codes', async () => {
      const testCases = [
        { status: 400, expectedMessage: 'Bad Request' },
        { status: 401, expectedMessage: 'Unauthorized' },
        { status: 403, expectedMessage: 'Forbidden' },
        { status: 429, expectedMessage: 'Too Many Requests' },
        { status: 500, expectedMessage: 'Internal Server Error' },
      ];

      for (const testCase of testCases) {
        const mockError = {
          message: testCase.expectedMessage,
          response: { status: testCase.status },
        };

        mockHttpService.axiosRef.get.mockRejectedValue(mockError);

        await expect(service.getCoinById('bitcoin')).rejects.toThrow(
          HttpException,
        );
      }
    });

    it('should handle network errors without response', async () => {
      const mockError = new Error('Network timeout');

      mockHttpService.axiosRef.get.mockRejectedValue(mockError);

      await expect(service.getCoinById('bitcoin')).rejects.toThrow(
        HttpException,
      );
    });
  });

  // 第一優先級新增方法的測試
  describe('getTrendingCoins', () => {
    it('should return trending coins data', async () => {
      const mockTrendingData = {
        coins: [
          {
            item: {
              id: 'bitcoin',
              name: 'Bitcoin',
              symbol: 'BTC',
              market_cap_rank: 1,
              thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
            },
          },
        ],
        nfts: [],
        categories: [],
      };

      const mockAxiosResponse: AxiosResponse = {
        data: mockTrendingData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      mockHttpService.get.mockReturnValue(of(mockAxiosResponse));

      const result = await service.getTrendingCoins();

      expect(result).toEqual(mockTrendingData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/search/trending',
        {
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'test-api-key',
          },
        },
      );
    });

    it('should throw HttpException when API call fails', async () => {
      const mockError = {
        message: 'Trending API Error',
        response: { status: 500 },
      };

      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getTrendingCoins()).rejects.toThrow(HttpException);
    });
  });

  describe('getSimplePrice', () => {
    it('should return simple price data for single coin', async () => {
      const mockPriceData = {
        bitcoin: {
          usd: 50000,
          usd_24h_change: 2.5,
          usd_24h_vol: 20000000000,
          usd_market_cap: 900000000000,
        },
      };

      const mockAxiosResponse: AxiosResponse = {
        data: mockPriceData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      mockHttpService.get.mockReturnValue(of(mockAxiosResponse));

      const result = await service.getSimplePrice(['bitcoin'], ['usd']);

      expect(result).toEqual(mockPriceData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'bitcoin',
            vs_currencies: 'usd',
            include_24hr_change: true,
            include_24hr_vol: true,
            include_market_cap: true,
          },
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'test-api-key',
          },
        },
      );
    });

    it('should handle multiple coins and currencies', async () => {
      const mockPriceData = {
        bitcoin: { usd: 50000, eur: 42000 },
        ethereum: { usd: 3000, eur: 2500 },
      };

      const mockAxiosResponse: AxiosResponse = {
        data: mockPriceData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      mockHttpService.get.mockReturnValue(of(mockAxiosResponse));

      const result = await service.getSimplePrice(
        ['bitcoin', 'ethereum'],
        ['usd', 'eur'],
      );

      expect(result).toEqual(mockPriceData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'bitcoin,ethereum',
            vs_currencies: 'usd,eur',
            include_24hr_change: true,
            include_24hr_vol: true,
            include_market_cap: true,
          },
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'test-api-key',
          },
        },
      );
    });

    it('should throw HttpException when API call fails', async () => {
      const mockError = {
        message: 'Simple Price API Error',
        response: { status: 400 },
      };

      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(
        service.getSimplePrice(['bitcoin'], ['usd']),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getGlobalMarketData', () => {
    it('should return global market data', async () => {
      const mockGlobalData = {
        data: {
          active_cryptocurrencies: 8500,
          upcoming_icos: 0,
          ongoing_icos: 49,
          ended_icos: 3376,
          markets: 650,
          total_market_cap: {
            usd: 2000000000000,
            eur: 1700000000000,
          },
          total_volume: {
            usd: 50000000000,
            eur: 42000000000,
          },
          market_cap_percentage: {
            btc: 50.2,
            eth: 18.5,
          },
        },
      };

      const mockAxiosResponse: AxiosResponse = {
        data: mockGlobalData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      mockHttpService.get.mockReturnValue(of(mockAxiosResponse));

      const result = await service.getGlobalMarketData();

      expect(result).toEqual(mockGlobalData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/global',
        {
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'test-api-key',
          },
        },
      );
    });

    it('should throw HttpException when API call fails', async () => {
      const mockError = {
        message: 'Global Market API Error',
        response: { status: 503 },
      };

      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getGlobalMarketData()).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('private getCoingeckoHeaders', () => {
    it('should return correct headers', () => {
      const headers = (service as any).getCoingeckoHeaders();

      expect(headers).toEqual({
        accept: 'application/json',
        'x-cg-demo-api-key': 'test-api-key',
      });
    });

    it('should use API key from config service', () => {
      // 直接測試方法調用了 configService.get
      (service as any).getCoingeckoHeaders();

      expect(mockConfigService.get).toHaveBeenCalledWith('apiKey');
    });
  });
});
