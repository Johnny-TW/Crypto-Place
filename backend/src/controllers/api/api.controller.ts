import { Controller, Get, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ApiService } from './api.service';
import {
  CoinMarketDto,
  CoinDetailDto,
  NftListItemDto,
  MarketChartDto,
  NewsItemDto,
  ExchangeDto,
} from './dto/api-response.dto';

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @ApiTags('crypto')
  @Get('coins/markets')
  @ApiOperation({
    summary: '獲取加密貨幣市場數據',
    description: '獲取加密貨幣市場的即時數據，包括價格、市值、交易量等資訊',
  })
  @ApiQuery({
    name: 'vs_currency',
    required: false,
    description: '對標貨幣 (預設: usd)',
    example: 'usd',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description: '排序方式 (預設: market_cap_desc)',
    example: 'market_cap_desc',
  })
  @ApiQuery({
    name: 'per_page',
    required: false,
    description: '每頁數量 (預設: 100)',
    example: 100,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '頁數 (預設: 1)',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取市場數據',
    type: [CoinMarketDto],
  })
  @ApiResponse({ status: 500, description: '伺服器錯誤' })
  async getCoinsMarkets(@Query() query: any) {
    return this.apiService.getCoinsMarkets(query);
  }

  @ApiTags('crypto')
  @Get('coins/:id')
  @ApiOperation({
    summary: '獲取加密貨幣詳細資訊',
    description:
      '根據 ID 獲取加密貨幣的詳細資訊，包括當前價格、歷史數據、市場統計等',
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取加密貨幣資訊',
    type: CoinDetailDto,
  })
  @ApiParam({
    name: 'id',
    description: '加密貨幣 ID，例如 bitcoin、ethereum 等',
    example: 'bitcoin',
  })
  async getCoinById(@Param('id') id: string) {
    return this.apiService.getCoinById(id);
  }

  @Get('nfts/list')
  @ApiTags('nft')
  @ApiOperation({
    summary: '獲取 NFT 列表',
    description: '獲取支援的 NFT 專案列表',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description: '排序方式 (預設: market_cap_usd_desc)',
    example: 'market_cap_usd_desc',
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取 NFT 列表',
    type: [NftListItemDto],
  })
  async getNftsList(@Query() query: any) {
    return this.apiService.getNftsList(query);
  }

  @Get('nfts/:id')
  @ApiTags('nft')
  @ApiOperation({
    summary: '獲取 NFT 專案資訊',
    description:
      '根據 ID 獲取 NFT 專案的詳細資訊，例如 cryptopunks、pudgy-penguins 等',
  })
  @ApiParam({
    name: 'id',
    description: 'NFT 專案 ID，例如 cryptopunks、pudgy-penguins 等',
    example: 'cryptopunks',
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取 NFT 專案資訊',
    type: NftListItemDto,
  })
  async getNftById(@Param('id') id: string) {
    return this.apiService.getNftById(id);
  }

  @ApiTags('crypto')
  @Get('coins/bitcoin/market_chart')
  @ApiOperation({
    summary: '獲取比特幣價格圖表',
    description: '獲取比特幣的歷史價格圖表數據',
  })
  @ApiQuery({
    name: 'vs_currency',
    required: false,
    description: '對標貨幣 (預設: usd)',
    example: 'usd',
  })
  @ApiQuery({
    name: 'days',
    required: false,
    description: '天數範圍 (預設: 30)',
    example: 30,
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取圖表數據',
    type: MarketChartDto,
  })
  async getBitcoinMarketChart(@Query() query: any) {
    return this.apiService.getBitcoinMarketChart(query);
  }

  @Get('news')
  @ApiTags('news')
  @ApiOperation({
    summary: '獲取加密貨幣新聞',
    description: '獲取最新的加密貨幣相關新聞',
  })
  @ApiQuery({
    name: 'lang',
    required: false,
    description: '語言 (預設: EN)',
    example: 'EN',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '數量限制 (預設: 4)',
    example: 4,
  })
  @ApiQuery({
    name: 'exclude_categories',
    required: false,
    description: '排除分類 (預設: ETH)',
    example: 'ETH',
  })
  @ApiQuery({
    name: 'categories',
    required: false,
    description: '新聞分類',
    example: 'BTC',
  })
  @ApiQuery({
    name: 'excludeCategories',
    required: false,
    description: '排除分類 (舊格式)',
    example: 'ETH',
  })
  @ApiQuery({
    name: 'lTs',
    required: false,
    description: '時間戳',
    example: '1704067200',
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取新聞',
    type: [NewsItemDto],
  })
  async getNews(@Query() query: any) {
    return this.apiService.getNews(query);
  }

  @ApiTags('crypto')
  @Get('crypto-details')
  @ApiOperation({
    summary: '獲取加密貨幣詳細資訊',
    description: '獲取特定加密貨幣的詳細資訊',
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取詳細資訊',
    type: CoinDetailDto,
  })
  async getCryptoDetails(@Query() query: any) {
    return this.apiService.getCryptoDetails(query);
  }

  @ApiTags('crypto')
  @Get('crypto-details/chart/:id')
  @ApiOperation({
    summary: '獲取加密貨幣詳細圖表',
    description: '根據幣種 ID 獲取對應的詳細圖表數據',
  })
  @ApiParam({
    name: 'id',
    description: '加密貨幣 ID，例如 bitcoin、ethereum、solana 等',
    example: 'bitcoin',
  })
  @ApiQuery({
    name: 'vs_currency',
    required: false,
    description: '對標貨幣 (預設: usd)',
    example: 'usd',
  })
  @ApiQuery({
    name: 'days',
    required: false,
    description: '天數範圍 (預設: 30)',
    example: 30,
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取圖表數據',
    type: MarketChartDto,
  })
  async getCryptoDetailsChart(@Param('id') id: string, @Query() query: any) {
    return this.apiService.getCryptoDetailsChart(id, query);
  }

  @Get('crypto-market-list')
  @ApiTags('market')
  @ApiOperation({
    summary: '獲取交易所列表',
    description: '獲取支援的加密貨幣交易所列表',
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取交易所列表',
    type: [ExchangeDto],
  })
  async getCryptoMarketList() {
    return this.apiService.getCryptoMarketList();
  }

  @Get('exchanges/:id')
  @ApiTags('market')
  @ApiOperation({
    summary: '獲取交易所詳細資訊',
    description: '根據 ID 獲取特定交易所的詳細資訊',
  })
  @ApiParam({
    name: 'id',
    description: '交易所 ID，例如 binance、coinbase-pro 等',
    example: 'binance',
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取交易所詳細資訊',
    type: ExchangeDto,
  })
  async getExchangeById(@Param('id') id: string) {
    return this.apiService.getExchangeById(id);
  }

  @Get('trending')
  @ApiTags('crypto')
  @ApiOperation({
    summary: '獲取熱門幣種',
    description: '獲取最近7天熱門搜尋的加密貨幣',
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取熱門幣種',
    schema: {
      type: 'object',
      properties: {
        coins: {
          type: 'array',
          description: '熱門幣種列表',
        },
        nfts: {
          type: 'array',
          description: '熱門NFT列表',
        },
        categories: {
          type: 'array',
          description: '熱門分類',
        },
      },
    },
  })
  async getTrendingCoins() {
    return this.apiService.getTrendingCoins();
  }

  @Get('simple/price')
  @ApiTags('crypto')
  @ApiOperation({
    summary: '獲取簡化價格數據',
    description: '高效獲取多個幣種的價格、市值和24小時變化',
  })
  @ApiQuery({
    name: 'ids',
    required: true,
    description: '幣種ID列表，用逗號分隔',
    example: 'bitcoin,ethereum,solana',
  })
  @ApiQuery({
    name: 'vs_currencies',
    required: false,
    description: '對標貨幣列表，用逗號分隔 (預設: usd)',
    example: 'usd,eur,jpy',
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取價格數據',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          usd: { type: 'number' },
          usd_24h_change: { type: 'number' },
          usd_24h_vol: { type: 'number' },
          usd_market_cap: { type: 'number' },
        },
      },
    },
  })
  async getSimplePrice(@Query() query: { ids: string; vs_currencies?: string }) {
    const ids = query.ids.split(',').map(id => id.trim());
    const vsCurrencies = query.vs_currencies ?
      query.vs_currencies.split(',').map(curr => curr.trim()) :
      ['usd'];

    return this.apiService.getSimplePrice(ids, vsCurrencies);
  }

  @Get('global')
  @ApiTags('market')
  @ApiOperation({
    summary: '獲取全球市場數據',
    description: '獲取全球加密貨幣市場的統計數據，包括總市值、24小時交易量等',
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取全球市場數據',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            total_market_cap: { type: 'object' },
            total_volume: { type: 'object' },
            market_cap_percentage: { type: 'object' },
            active_cryptocurrencies: { type: 'number' },
            upcoming_icos: { type: 'number' },
            ongoing_icos: { type: 'number' },
            ended_icos: { type: 'number' },
            markets: { type: 'number' },
          },
        },
      },
    },
  })
  async getGlobalMarketData() {
    return this.apiService.getGlobalMarketData();
  }
}
