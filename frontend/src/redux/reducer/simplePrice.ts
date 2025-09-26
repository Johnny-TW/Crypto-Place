import { BaseAction } from '../../types/redux';

export interface SimplePriceData {
  [coinId: string]: {
    usd: number;
    usd_24h_change?: number;
    usd_24h_vol?: number;
    usd_market_cap?: number;
  };
}

export interface SimplePriceParams {
  ids: string[];
  vsCurrencies: string;
  include24hrChange: boolean;
  include24hrVol: boolean;
  includeMarketCap: boolean;
}

interface SimplePriceState {
  data: SimplePriceData | null;
  loading: boolean;
  error: string | null;
}

const initialState: SimplePriceState = {
  data: null,
  loading: false,
  error: null,
};

const simplePriceReducer = (
  state: SimplePriceState = initialState,
  action: BaseAction
): SimplePriceState => {
  switch (action.type) {
    case 'FETCH_SIMPLE_PRICE':
      return { ...state, loading: true, error: null };
    case 'FETCH_SIMPLE_PRICE_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_SIMPLE_PRICE_FAILURE':
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default simplePriceReducer;
