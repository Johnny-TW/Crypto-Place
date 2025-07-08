import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../src/config/configuration';
import { ApiService } from '../../src/api/api.service';
import { ApiController } from '../../src/api/api.controller';
import { HttpException } from '@nestjs/common';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('API Integration Tests', () => {
  let apiController: ApiController;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
      controllers: [ApiController],
      providers: [ApiService],
    }).compile();

    apiController = module.get<ApiController>(ApiController);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('Configuration Integration', () => {
    it('should load configuration correctly', () => {
      expect(configService.get('coingeckoApiUrl')).toBeDefined();
      expect(configService.get('cryptocompareApiUrl')).toBeDefined();
      expect(configService.get('apiKey')).toBeDefined();
    });

    it('should use correct API URLs', () => {
      const coingeckoUrl = configService.get('coingeckoApiUrl');
      const cryptocompareUrl = configService.get('cryptocompareApiUrl');

      expect(coingeckoUrl).toContain('coingecko.com');
      expect(cryptocompareUrl).toContain('cryptocompare.com');
    });
  });

  describe('Service-Controller Integration', () => {
    it('should integrate controller with service for coins markets', async () => {
      const mockMarketData = [
        { id: 'bitcoin', name: 'Bitcoin', current_price: 50000 },
      ];

      const mockAxiosResponse: AxiosResponse = {
        data: mockMarketData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

      const query = { vs_currency: 'usd', per_page: 10 };
      const result = await apiController.getCoinsMarkets(query);

      expect(result).toEqual(mockMarketData);
      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringContaining('/coins/markets'),
        expect.objectContaining({
          params: expect.objectContaining(query),
          headers: expect.objectContaining({
            accept: 'application/json',
            'x-cg-demo-api-key': expect.any(String),
          }),
        }),
      );
    });

    it('should integrate controller with service for coin by ID', async () => {
      const mockCoinData = {
        id: 'bitcoin',
        name: 'Bitcoin',
        current_price: { usd: 50000 },
      };

      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue({
        data: mockCoinData,
      });

      const result = await apiController.getCoinById('bitcoin');

      expect(result).toEqual(mockCoinData);
      expect(httpService.axiosRef.get).toHaveBeenCalledWith(
        expect.stringContaining('/coins/bitcoin'),
        expect.objectContaining({
          headers: expect.objectContaining({
            accept: 'application/json',
            'x-cg-demo-api-key': expect.any(String),
          }),
        }),
      );
    });

    it('should integrate controller with service for NFTs list', async () => {
      const mockNftData = [{ id: 'cryptopunks', name: 'CryptoPunks' }];

      const mockAxiosResponse: AxiosResponse = {
        data: mockNftData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

      const query = { order: 'market_cap_usd_desc' };
      const result = await apiController.getNftsList(query);

      expect(result).toEqual(mockNftData);
      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringContaining('/nfts/list'),
        expect.objectContaining({
          params: expect.objectContaining(query),
        }),
      );
    });

    it('should integrate controller with service for crypto news', async () => {
      const mockNewsData = {
        Data: [
          { id: '1', title: 'Bitcoin News', body: 'Bitcoin price update' },
        ],
      };

      const mockAxiosResponse: AxiosResponse = {
        data: mockNewsData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

      const query = { lang: 'EN', limit: 4 };
      const result = await apiController.getNews(query);

      expect(result).toEqual(mockNewsData);
      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringContaining('cryptocompare.com'),
        expect.objectContaining({
          params: expect.objectContaining(query),
        }),
      );
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle HTTP errors properly in the integration flow', async () => {
      const mockError = {
        message: 'Network Error',
        response: { status: 500 },
      };

      jest.spyOn(httpService.axiosRef, 'get').mockRejectedValue(mockError);

      await expect(apiController.getCoinById('invalid-coin')).rejects.toThrow(
        HttpException,
      );
    });

    it('should handle API rate limiting errors', async () => {
      const mockError = {
        message: 'Rate Limited',
        response: { status: 429 },
      };

      jest.spyOn(httpService.axiosRef, 'get').mockRejectedValue(mockError);

      await expect(apiController.getCoinById('bitcoin')).rejects.toThrow(
        HttpException,
      );
    });

    it('should handle 404 errors for non-existent resources', async () => {
      const mockError = {
        message: 'Not Found',
        response: { status: 404 },
      };

      jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw mockError;
      });

      await expect(
        apiController.getNftById('non-existent-nft'),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('Data Flow Integration', () => {
    it('should maintain data integrity from service to controller', async () => {
      const originalData = {
        id: 'bitcoin',
        name: 'Bitcoin',
        current_price: { usd: 50000, eur: 42000 },
        market_cap: { usd: 950000000000 },
        total_volume: { usd: 30000000000 },
      };

      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue({
        data: originalData,
      });

      const result = await apiController.getCoinById('bitcoin');

      expect(result).toEqual(originalData);
      expect(result.current_price.usd).toBe(50000);
      expect(result.market_cap.usd).toBe(950000000000);
    });

    it('should handle complex query parameters correctly', async () => {
      const complexQuery = {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 250,
        page: 1,
        sparkline: false,
        price_change_percentage: '1h,24h,7d',
      };

      const mockResponse: AxiosResponse = {
        data: [{ id: 'bitcoin', name: 'Bitcoin' }],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      await apiController.getCoinsMarkets(complexQuery);

      expect(httpService.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 250,
            page: 1,
            sparkline: false,
            price_change_percentage: '1h,24h,7d',
          }),
        }),
      );
    });
  });

  describe('API Key Integration', () => {
    it('should include API key in requests to CoinGecko', async () => {
      const mockResponse: AxiosResponse = {
        data: [{ id: 'bitcoin' }],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      await apiController.getCoinsMarkets({});

      expect(httpService.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-cg-demo-api-key': expect.any(String),
          }),
        }),
      );
    });

    it('should not include API key in requests to CryptoCompare', async () => {
      const mockResponse: AxiosResponse = {
        data: { Data: [] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as any;

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      await apiController.getNews({});

      expect(httpService.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.any(Object),
        }),
      );

      const callArgs = (httpService.get as jest.Mock).mock.calls[0][1];
      expect(callArgs.headers).toBeUndefined();
    });
  });
});
