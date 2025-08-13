import { ApiProperty } from '@nestjs/swagger';

export class CoinMarketDto {
  @ApiProperty({
    example: 'bitcoin',
    description: '加密貨幣 ID',
  })
  id: string;

  @ApiProperty({
    example: 'btc',
    description: '加密貨幣符號',
  })
  symbol: string;

  @ApiProperty({
    example: 'Bitcoin',
    description: '加密貨幣名稱',
  })
  name: string;

  @ApiProperty({
    example: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    description: '圖片 URL',
  })
  image: string;

  @ApiProperty({
    example: 43250.75,
    description: '當前價格 (USD)',
  })
  current_price: number;

  @ApiProperty({
    example: 851234567890,
    description: '市值',
  })
  market_cap: number;

  @ApiProperty({
    example: 1,
    description: '市值排名',
  })
  market_cap_rank: number;

  @ApiProperty({
    example: 25678901234,
    description: '24小時交易量',
  })
  total_volume: number;

  @ApiProperty({
    example: 2.5,
    description: '24小時價格變化百分比',
  })
  price_change_percentage_24h: number;
}

export class CoinDetailDto {
  @ApiProperty({
    example: 'bitcoin',
    description: '加密貨幣 ID',
  })
  id: string;

  @ApiProperty({
    example: 'Bitcoin',
    description: '加密貨幣名稱',
  })
  name: string;

  @ApiProperty({
    example: 'BTC',
    description: '加密貨幣符號',
  })
  symbol: string;

  @ApiProperty({
    example: {
      usd: 43250.75,
      eur: 39876.23,
      btc: 1.0,
    },
    description: '當前價格（多種貨幣）',
  })
  current_price: object;

  @ApiProperty({
    example: {
      usd: 851234567890,
      eur: 784521345678,
    },
    description: '市值（多種貨幣）',
  })
  market_cap: object;

  @ApiProperty({
    example: 1,
    description: '市值排名',
  })
  market_cap_rank: number;

  @ApiProperty({
    example: 'Bitcoin is a decentralized digital currency...',
    description: '項目描述',
  })
  description: object;

  @ApiProperty({
    example: {
      homepage: ['https://bitcoin.org/'],
      blockchain_site: ['https://blockchair.com/bitcoin/'],
      official_forum_url: ['https://bitcointalk.org/'],
    },
    description: '相關連結',
  })
  links: object;
}

export class NftListItemDto {
  @ApiProperty({
    example: 'cryptopunks',
    description: 'NFT 專案 ID',
  })
  id: string;

  @ApiProperty({
    example: 'CryptoPunks',
    description: 'NFT 專案名稱',
  })
  name: string;

  @ApiProperty({
    example: 'https://www.larvalabs.com/cryptopunks',
    description: '專案網站',
  })
  asset_platform_id: string;

  @ApiProperty({
    example:
      'https://assets.coingecko.com/nft_contracts/images/12/large/cryptopunks.png',
    description: 'NFT 圖片 URL',
  })
  image: object;

  @ApiProperty({
    example: 'One of the earliest NFT projects on Ethereum...',
    description: 'NFT 專案描述',
  })
  description: string;

  @ApiProperty({
    example: 285.75,
    description: '地板價 (ETH)',
  })
  floor_price: object;
}

export class MarketChartDto {
  @ApiProperty({
    example: [
      [1704067200000, 43250.75],
      [1704153600000, 43890.23],
      [1704240000000, 44125.67],
    ],
    description: '價格數據 [時間戳, 價格]',
  })
  prices: number[][];

  @ApiProperty({
    example: [
      [1704067200000, 851234567890],
      [1704153600000, 864523789012],
      [1704240000000, 870123456789],
    ],
    description: '市值數據 [時間戳, 市值]',
  })
  market_caps: number[][];

  @ApiProperty({
    example: [
      [1704067200000, 25678901234],
      [1704153600000, 26543210987],
      [1704240000000, 24987654321],
    ],
    description: '交易量數據 [時間戳, 交易量]',
  })
  total_volumes: number[][];
}

export class NewsItemDto {
  @ApiProperty({
    example: 'crypto-news-12345',
    description: '新聞 ID',
  })
  id: string;

  @ApiProperty({
    example: 'Bitcoin Reaches New All-Time High',
    description: '新聞標題',
  })
  title: string;

  @ApiProperty({
    example: 'Bitcoin has reached a new all-time high of $44,000...',
    description: '新聞內容',
  })
  content: string;

  @ApiProperty({
    example: 'https://example.com/news/bitcoin-ath',
    description: '新聞連結',
  })
  url: string;

  @ApiProperty({
    example: 'CoinDesk',
    description: '新聞來源',
  })
  source: string;

  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: '發布時間',
  })
  published_at: string;

  @ApiProperty({
    example: 'https://example.com/images/bitcoin-news.jpg',
    description: '新聞圖片',
  })
  image_url: string;
}

export class ExchangeDto {
  @ApiProperty({
    example: 'binance',
    description: '交易所 ID',
  })
  id: string;

  @ApiProperty({
    example: 'Binance',
    description: '交易所名稱',
  })
  name: string;

  @ApiProperty({
    example: 2023,
    description: '成立年份',
  })
  year_established: number;

  @ApiProperty({
    example: 'Malta',
    description: '國家',
  })
  country: string;

  @ApiProperty({
    example: 'https://www.binance.com/',
    description: '交易所網站',
  })
  url: string;

  @ApiProperty({
    example: 'https://assets.coingecko.com/markets/images/52/large/binance.jpg',
    description: '交易所圖片',
  })
  image: string;

  @ApiProperty({
    example: 85432109876.54,
    description: '24小時交易量 (BTC)',
  })
  trade_volume_24h_btc: number;

  @ApiProperty({
    example: 10,
    description: '信任分數',
  })
  trust_score: number;
}
