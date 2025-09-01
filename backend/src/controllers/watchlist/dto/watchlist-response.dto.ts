import { ApiProperty } from '@nestjs/swagger';

export class WatchlistResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'bitcoin' })
  coinId: string;

  @ApiProperty({ example: 'Bitcoin' })
  coinName: string;

  @ApiProperty({ example: 'BTC' })
  symbol: string;

  @ApiProperty({ 
    example: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    required: false 
  })
  image?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;
}

export class WatchlistWithPriceDto extends WatchlistResponseDto {
  @ApiProperty({ example: 45000, description: '當前價格 (USD)' })
  currentPrice?: number;

  @ApiProperty({ example: 2.5, description: '24小時價格變化百分比' })
  priceChange24h?: number;

  @ApiProperty({ example: 850000000000, description: '市值' })
  marketCap?: number;
}