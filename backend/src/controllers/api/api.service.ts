import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);
  private readonly coingeckoApiUrl: string;
  private readonly cryptocompareApiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.coingeckoApiUrl = this.configService.get<string>('coingeckoApiUrl');
    this.cryptocompareApiUrl = this.configService.get<string>(
      'cryptocompareApiUrl',
    );
    this.apiKey = this.configService.get<string>('apiKey');
  }

  async getCoinById(id: string): Promise<any> {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.coingeckoApiUrl}/coins/${id}`,
        {
          headers: this.getCoingeckoHeaders(),
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching coin data for ${id}:`, error.message);
      throw new HttpException(
        { error: error.message },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCoinsMarkets(query: any) {
    const params = {
      vs_currency: query.vs_currency || 'usd',
      order: query.order || 'market_cap_desc',
      per_page: query.per_page || 100,
      page: query.page || 1,
      ...query,
    };
    const cacheKey = `coins_markets:${JSON.stringify(params)}`;

    try {
      // 檢查快取
      const cachedData = await this.cacheManager.get(cacheKey);
      if (cachedData) {
        this.logger.log(`✓ Cache hit for coins markets (page ${params.page})`);
        return cachedData;
      }

      this.logger.log(`→ Fetching coins markets from CoinGecko API (page ${params.page})`);
      const response = await firstValueFrom(
        this.httpService.get(`${this.coingeckoApiUrl}/coins/markets`, {
          params,
          headers: this.getCoingeckoHeaders(),
        }).pipe(
          timeout(25000), // 使用 RxJS timeout operator
        ),
      );

      // 儲存到快取 (45秒)
      await this.cacheManager.set(cacheKey, response.data, 45000);
      this.logger.log(`✓ Successfully fetched and cached ${response.data.length} coins from markets`);
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching coins markets:', error.message);
      if (error.name === 'TimeoutError' || error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        this.logger.error('Request timeout - CoinGecko API may be slow or rate limited');
      }
      throw new HttpException(
        {
          error: error.message || 'Request timeout',
          details: 'CoinGecko API 請求超時或速率限制，請稍後再試',
        },
        error.response?.status || HttpStatus.GATEWAY_TIMEOUT,
      );
    }
  }

  async getCoinBitcoin() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.coingeckoApiUrl}/coins/bitcoin`, {
          headers: this.getCoingeckoHeaders(),
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching coin data:', error.message);
      throw new HttpException(
        { error: error.message },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNftsList(query: any = {}) {
    const cacheKey = `nfts_list_${JSON.stringify(query)}`;

    try {
      // 檢查快取
      const cachedData = await this.cacheManager.get(cacheKey);
      if (cachedData) {
        this.logger.log('🎯 Returning cached NFT list data');
        return cachedData;
      }

      const params = {
        order: query.order || 'market_cap_usd_desc',
        ...query,
      };

      this.logger.log('📡 Fetching NFT list from CoinGecko API...');
      const response = await firstValueFrom(
        this.httpService.get(`${this.coingeckoApiUrl}/nfts/list`, {
          params,
          headers: this.getCoingeckoHeaders(),
        }),
      );

      // 快取 10 分鐘（NFT 資料更新較慢，減少 API 請求）
      await this.cacheManager.set(cacheKey, response.data, 600000);
      this.logger.log('✅ NFT list data cached for 10 minutes');

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching NFT list:', error.message);

      // 如果是 429 錯誤，提供更友善的錯誤訊息
      if (error.response?.status === 429) {
        throw new HttpException(
          {
            error: 'API rate limit exceeded',
            message: 'CoinGecko API 請求過於頻繁，請稍後再試',
            retryAfter: error.response?.headers?.['retry-after'] || 60,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      throw new HttpException(
        { error: error.message },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNftById(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.coingeckoApiUrl}/nfts/${id}`, {
          headers: this.getCoingeckoHeaders(),
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching NFT data for ${id}:`, error.message);
      throw new HttpException(
        { error: error.message },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBitcoinMarketChart(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.coingeckoApiUrl}/coins/bitcoin/market_chart`,
          {
            params: query,
            headers: this.getCoingeckoHeaders(),
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching market chart:', error.message);
      throw new HttpException(
        { error: error.message },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNews(query: any) {
    try {
      this.logger.log('Fetching news with query:', JSON.stringify(query));

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.cryptocompareApiUrl}/news/v1/article/list`,
          {
            params: query,
          },
        ),
      );

      // 檢查響應數據結構
      this.logger.log('CryptoCompare API response structure:',
        Object.keys(response.data));

      if (response.data && response.data.Data && Array.isArray(response.data.Data)) {
        this.logger.log(`Found ${response.data.Data.length} news items`);

        // 記錄第一個新聞項目的欄位，以確認圖片欄位
        if (response.data.Data.length > 0) {
          this.logger.log('First news item fields:',
            Object.keys(response.data.Data[0]));

          // 檢查所有可能的圖片欄位名稱
          const imageFields = ['imageurl', 'image_url', 'IMAGE_URL', 'image', 'thumbnail'];
          imageFields.forEach(field => {
            this.logger.log(`Image field ${field} value:`,
              response.data.Data[0][field]);
          });

          // 如果 IMAGE_URL 欄位存在但值為 undefined，添加一個後備圖片 URL
          if ('IMAGE_URL' in response.data.Data[0] && !response.data.Data[0].IMAGE_URL) {
            this.logger.log('Adding fallback image URL to missing IMAGE_URL field');
            response.data.Data = response.data.Data.map(item => {
              if ('IMAGE_URL' in item && !item.IMAGE_URL) {
                // 使用固定的加密貨幣圖片作為後備圖片
                item.IMAGE_URL = 'https://www.cryptocompare.com/media/37746251/btc.png';
              }
              return item;
            });
          }
        }
      }

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching crypto news:', error.message);
      throw new HttpException(
        { error: error.message },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCryptoDetails(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.coingeckoApiUrl}/coins`, {
          params: query,
          headers: this.getCoingeckoHeaders(),
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching crypto details:', error.message);
      throw new HttpException(
        { error: error.message },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCryptoDetailsChart(coinId: string, query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.coingeckoApiUrl}/coins/${coinId}/market_chart`,
          {
            params: query,
            headers: this.getCoingeckoHeaders(),
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching crypto details chart for ${coinId}:`, error.message);
      throw new HttpException(
        { error: error.message },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCryptoMarketList() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.coingeckoApiUrl}/exchanges`, {
          headers: this.getCoingeckoHeaders(),
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching crypto market list:', error.message);
      throw new HttpException(
        { error: error.message },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getExchangeById(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.coingeckoApiUrl}/exchanges/${id}`, {
          headers: this.getCoingeckoHeaders(),
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Error fetching exchange data for ${id}:`,
        error.message,
      );
      throw new HttpException(
        { error: error.message },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getExchangeTickersById(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.coingeckoApiUrl}/exchanges/${id}/tickers`,
          {
            headers: this.getCoingeckoHeaders(),
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Error fetching exchange tickers for ${id}:`,
        error.message,
      );
      throw new HttpException(
        { error: error.message },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 第一優先級 API 方法
  async getTrendingCoins() {
    const cacheKey = 'trending_coins';

    try {
      // 檢查快取
      const cachedData = await this.cacheManager.get(cacheKey);
      if (cachedData) {
        this.logger.log('✓ Cache hit for trending coins');
        return cachedData;
      }

      this.logger.log('→ Fetching trending coins from CoinGecko API');
      const response = await firstValueFrom(
        this.httpService.get(`${this.coingeckoApiUrl}/search/trending`, {
          headers: this.getCoingeckoHeaders(),
        }),
      );

      // 儲存到快取 (120秒 - 熱門幣種變化較慢)
      await this.cacheManager.set(cacheKey, response.data, 120000);
      this.logger.log('✓ Successfully fetched and cached trending coins');
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching trending coins:', error.message);
      throw new HttpException(
        { error: error.message },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSimplePrice(ids: string[], vs_currencies: string[] = ['usd']) {
    const cacheKey = `simple_price:${ids.sort().join(',')}:${vs_currencies.join(',')}`;

    try {
      // 檢查快取
      const cachedData = await this.cacheManager.get(cacheKey);
      if (cachedData) {
        this.logger.log(`✓ Cache hit for simple price: ${ids.length} coins`);
        return cachedData;
      }

      this.logger.log(`→ Fetching simple price from CoinGecko API: ${ids.length} coins`);
      const response = await firstValueFrom(
        this.httpService.get(`${this.coingeckoApiUrl}/simple/price`, {
          params: {
            ids: ids.join(','),
            vs_currencies: vs_currencies.join(','),
            include_24hr_change: true,
            include_24hr_vol: true,
            include_market_cap: true,
          },
          headers: this.getCoingeckoHeaders(),
        }).pipe(
          timeout(25000), // 使用 RxJS timeout operator
        ),
      );

      // 儲存到快取30秒
      await this.cacheManager.set(cacheKey, response.data, 30000);
      this.logger.log(`✓ Successfully fetched and cached simple prices for ${ids.length} coins`);
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching simple price:', error.message);
      if (error.name === 'TimeoutError' || error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        this.logger.error('Request timeout - CoinGecko API may be slow or rate limited');
      }
      throw new HttpException(
        {
          error: error.message || 'Request timeout',
          details: 'CoinGecko API 請求超時或速率限制，請稍後再試',
        },
        error.response?.status || HttpStatus.GATEWAY_TIMEOUT,
      );
    }
  }

  async getGlobalMarketData() {
    const cacheKey = 'global_market_data';

    try {
      // 檢查快取
      const cachedData = await this.cacheManager.get(cacheKey);
      if (cachedData) {
        this.logger.log('✓ Cache hit for global market data');
        return cachedData;
      }

      this.logger.log('→ Fetching global market data from CoinGecko API');
      const response = await firstValueFrom(
        this.httpService.get(`${this.coingeckoApiUrl}/global`, {
          headers: this.getCoingeckoHeaders(),
        }).pipe(
          timeout(25000),
        ),
      );

      // 儲存到快取60秒
      await this.cacheManager.set(cacheKey, response.data, 60000);
      this.logger.log('✓ Successfully fetched and cached global market data');
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching global market data:', error.message);
      if (error.name === 'TimeoutError' || error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        this.logger.error('Request timeout - CoinGecko API may be slow or rate limited');
      }
      throw new HttpException(
        {
          error: error.message || 'Request timeout',
          details: 'CoinGecko API 請求超時或速率限制，請稍後再試',
        },
        error.response?.status || HttpStatus.GATEWAY_TIMEOUT,
      );
    }
  }

  private getCoingeckoHeaders() {
    const headers: any = {
      accept: 'application/json',
    };

    // 使用 API Key 提高速率限制
    const apiKey = this.configService.get<string>('COINGECKO_API_KEY') || this.apiKey;
    if (apiKey && apiKey !== 'your_coingecko_api_key') {
      headers['x-cg-demo-api-key'] = apiKey;
      this.logger.debug('✓ Using CoinGecko API Key for authenticated requests');
    } else {
      this.logger.warn('⚠️ No valid CoinGecko API Key found, using public endpoint (stricter rate limits)');
    }

    return headers;
  }
}
