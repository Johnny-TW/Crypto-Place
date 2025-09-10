import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);
  private readonly coingeckoApiUrl: string;
  private readonly cryptocompareApiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
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
        `https://api.coingecko.com/api/v3/coins/${id}`,
        {
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': process.env.API_KEY,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error fetching coin data for ${id}: ${error.message}`,
        error.response?.status || 500,
      );
    }
  }

  async getCoinsMarkets(query: any) {
    try {
      const params = {
        vs_currency: query.vs_currency || 'usd',
        order: query.order || 'market_cap_desc',
        per_page: query.per_page || 100,
        page: query.page || 1,
        ...query,
      };

      const response = await firstValueFrom(
        this.httpService.get(`${this.coingeckoApiUrl}/coins/markets`, {
          params,
          headers: this.getCoingeckoHeaders(),
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching coins markets:', error.message);
      throw new HttpException(
        { error: error.message },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
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
    try {
      const params = {
        order: query.order || 'market_cap_usd_desc',
        ...query,
      };

      const response = await firstValueFrom(
        this.httpService.get(`${this.coingeckoApiUrl}/nfts/list`, {
          params,
          headers: this.getCoingeckoHeaders(),
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching NFT list:', error.message);
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

  private getCoingeckoHeaders() {
    return {
      accept: 'application/json',
      'x-cg-demo-api-key': this.apiKey,
    };
  }
}
