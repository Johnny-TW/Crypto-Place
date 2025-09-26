import { BaseAction } from '../../types/redux';

export interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    price_btc: number;
    score: number;
  };
  data?: {
    sparkline: string;
  };
}

export interface TrendingNFT {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  nft_contract_id?: number;
  native_currency_symbol: string;
  floor_price_in_native_currency?: number;
  floor_price_24h_percentage_change?: number;
}

export interface TrendingCategory {
  id: number;
  name: string;
  market_cap_1h_change: number;
  slug: string;
  coins_count: number;
  data?: {
    sparkline: string;
    market_cap?: number;
    market_cap_btc?: number;
    total_volume?: number;
    total_volume_btc?: number;
    market_cap_change_percentage_24h?: Record<string, number>;
  };
}

export interface TrendingData {
  coins: TrendingCoin[];
  nfts: TrendingNFT[];
  categories: TrendingCategory[];
}

interface TrendingCoinsState {
  data: TrendingData | null;
  loading: boolean;
  error: string | null;
}

const initialState: TrendingCoinsState = {
  data: null,
  loading: false,
  error: null,
};

const trendingCoinsReducer = (
  state: TrendingCoinsState = initialState,
  action: BaseAction
): TrendingCoinsState => {
  switch (action.type) {
    case 'FETCH_TRENDING_COINS':
      return { ...state, loading: true, error: null };
    case 'FETCH_TRENDING_COINS_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_TRENDING_COINS_FAILURE':
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default trendingCoinsReducer;
