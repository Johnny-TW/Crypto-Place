import { BaseAction } from '../../types/redux';

interface GlobalMarketData {
  data: {
    active_cryptocurrencies: number;
    upcoming_icos: number;
    ongoing_icos: number;
    ended_icos: number;
    markets: number;
    total_market_cap: {
      usd: number;
      btc: number;
      eth: number;
    };
    total_volume: {
      usd: number;
      btc: number;
      eth: number;
    };
    market_cap_percentage: {
      btc: number;
      eth: number;
      [key: string]: number;
    };
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
}

interface GlobalMarketDataState {
  data: GlobalMarketData | null;
  loading: boolean;
  error: string | null;
}

const initialState: GlobalMarketDataState = {
  data: null,
  loading: false,
  error: null,
};

const globalMarketDataReducer = (
  state: GlobalMarketDataState = initialState,
  action: BaseAction
): GlobalMarketDataState => {
  switch (action.type) {
    case 'FETCH_GLOBAL_MARKET_DATA':
      return { ...state, loading: true, error: null };
    case 'FETCH_GLOBAL_MARKET_DATA_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_GLOBAL_MARKET_DATA_FAILURE':
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default globalMarketDataReducer;
