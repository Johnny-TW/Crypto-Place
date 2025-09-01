import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWatchlistDto {
  @ApiProperty({
    description: 'CoinGecko 幣種 ID',
    example: 'bitcoin',
  })
  @IsString()
  @IsNotEmpty()
  coinId: string;

  @ApiProperty({
    description: '幣種名稱',
    example: 'Bitcoin',
  })
  @IsString()
  @IsNotEmpty()
  coinName: string;

  @ApiProperty({
    description: '幣種符號',
    example: 'BTC',
  })
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty({
    description: '幣種圖片 URL',
    example: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;
}