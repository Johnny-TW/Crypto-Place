import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('system')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    summary: '歡迎頁面',
    description: '顯示 API 的基本資訊和可用端點列表',
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取歡迎資訊',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Welcome to EE40 - Crypto Place API' },
        endpoints: {
          type: 'object',
          description: '可用的 API 端點',
        },
      },
    },
  })
  getWelcome() {
    return {
      message: 'Welcome to EE40 - Crypto Place API',
      version: '2.0.0',
      description: '提供加密貨幣、NFT、新聞等數據的 API 服務',
      documentation: '/api/docs',
      endpoints: {
        coins: '/api/coins/markets',
        coinById: '/api/coins/:id',
        nfts: '/api/nfts/list',
        nftById: '/api/nfts/:id',
        marketData: '/api/coins/bitcoin/market_chart',
        news: '/api/news',
        cryptoDetails: '/api/crypto-details',
        cryptoDetailsChart: '/api/crypto-details/chart/:id',
        cryptoMarketList: '/api/crypto-market-list',
      },
    };
  }

  @Get('health')
  @ApiOperation({
    summary: '健康檢查',
    description: '檢查 API 服務的運行狀態',
  })
  @ApiResponse({
    status: 200,
    description: '服務運行正常',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-06-09T05:54:52.000Z' },
        uptime: { type: 'number', example: 123.456 },
      },
    },
  })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      node_version: process.version,
    };
  }
}
