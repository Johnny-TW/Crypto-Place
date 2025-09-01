import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WatchlistService } from './watchlist.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { WatchlistResponseDto, WatchlistWithPriceDto } from './dto/watchlist-response.dto';

@Controller('watchlist')
@ApiTags('watchlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post()
  @ApiOperation({
    summary: '新增幣種到最愛',
    description: '將指定的加密貨幣新增到用戶的最愛列表',
  })
  @ApiResponse({
    status: 201,
    description: '成功新增到最愛',
    type: WatchlistResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: '幣種已在最愛列表中',
  })
  async addToWatchlist(
    @Req() req: any,
    @Body() createWatchlistDto: CreateWatchlistDto,
  ) {
    // 確保 userId 是數字類型
    const userId = Number(req.user.id);
    
    if (isNaN(userId)) {
      throw new Error('Invalid userId in request: must be a number');
    }
    
    return this.watchlistService.addToWatchlist(userId, createWatchlistDto);
  }

  @Delete(':coinId')
  @ApiOperation({
    summary: '從最愛移除幣種',
    description: '將指定的加密貨幣從用戶的最愛列表中移除',
  })
  @ApiParam({
    name: 'coinId',
    description: 'CoinGecko 幣種 ID',
    example: 'bitcoin',
  })
  @ApiResponse({
    status: 200,
    description: '成功從最愛移除',
  })
  @ApiResponse({
    status: 404,
    description: '在最愛列表中找不到此幣種',
  })
  async removeFromWatchlist(@Req() req: any, @Param('coinId') coinId: string) {
    // 確保 userId 是數字類型
    const userId = Number(req.user.id);
    
    if (isNaN(userId)) {
      throw new Error('Invalid userId in request: must be a number');
    }
    
    return this.watchlistService.removeFromWatchlist(userId, coinId);
  }

  @Get()
  @ApiOperation({
    summary: '獲取用戶最愛列表',
    description: '獲取用戶的完整最愛列表，包含即時價格資料',
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取最愛列表',
    type: [WatchlistWithPriceDto],
  })
  async getUserWatchlist(@Req() req: any) {
    // 確保 userId 是數字類型
    const userId = Number(req.user.id);
    
    if (isNaN(userId)) {
      throw new Error('Invalid userId in request: must be a number');
    }
    
    return this.watchlistService.getUserWatchlist(userId);
  }

  @Get('check/:coinId')
  @ApiOperation({
    summary: '檢查幣種是否在最愛中',
    description: '檢查指定的幣種是否已加入用戶的最愛列表',
  })
  @ApiParam({
    name: 'coinId',
    description: 'CoinGecko 幣種 ID',
    example: 'bitcoin',
  })
  @ApiResponse({
    status: 200,
    description: '返回檢查結果',
    schema: {
      properties: {
        isInWatchlist: { type: 'boolean' },
      },
    },
  })
  async checkIsInWatchlist(@Req() req: any, @Param('coinId') coinId: string) {
    // 確保 userId 是數字類型
    const userId = Number(req.user.id);
    
    if (isNaN(userId)) {
      throw new Error('Invalid userId in request: must be a number');
    }
    
    const isInWatchlist = await this.watchlistService.isInWatchlist(userId, coinId);
    return { isInWatchlist };
  }

  @Post('check-batch')
  @ApiOperation({
    summary: '批量檢查幣種是否在最愛中',
    description: '一次性檢查多個幣種是否已加入用戶的最愛列表',
  })
  @ApiResponse({
    status: 200,
    description: '返回批量檢查結果',
    schema: {
      type: 'object',
      additionalProperties: { type: 'boolean' },
      example: {
        bitcoin: true,
        ethereum: false,
        cardano: true,
      },
    },
  })
  async checkBatchInWatchlist(
    @Req() req: any,
    @Body() body: { coinIds: string[] },
  ) {
    // 確保 userId 是數字類型
    const userId = Number(req.user.id);
    
    if (isNaN(userId)) {
      throw new Error('Invalid userId in request: must be a number');
    }
    
    if (!Array.isArray(body.coinIds) || body.coinIds.length === 0) {
      return {};
    }
    
    return this.watchlistService.checkBatchInWatchlist(userId, body.coinIds);
  }

  @Get('count')
  @ApiOperation({
    summary: '獲取最愛數量',
    description: '獲取用戶最愛列表中的幣種總數',
  })
  @ApiResponse({
    status: 200,
    description: '返回最愛數量',
    schema: {
      properties: {
        count: { type: 'number' },
      },
    },
  })
  async getWatchlistCount(@Req() req: any) {
    // 確保 userId 是數字類型
    const userId = Number(req.user.id);
    
    if (isNaN(userId)) {
      throw new Error('Invalid userId in request: must be a number');
    }
    
    const count = await this.watchlistService.getWatchlistCount(userId);
    return { count };
  }
}