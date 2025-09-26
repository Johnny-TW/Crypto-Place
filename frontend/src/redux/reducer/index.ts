import { combineReducers } from 'redux';
import coinListReducer from './cryptoDashboard';
import cryptoNewsReducer from './cryptoNews';
import cryptoDetailsReducer from './cryptoDetails';
import cryptoDetailsChartReducer from './cryptoCoinChart';
import cryptoMarketListReducer from './cryptoMarketList';
import cryptoExchangesDetailsReducer from './cryptoExchangesDetails';
import nftDashboardReducer from './nftDashboard';
import nftDetailsReducer from './nftDetails';
import employeeInfoReducer from './employeeInfo';
import authReducer from './auth';
import watchlistReducer from './watchlist';
import globalMarketDataReducer from './globalMarketData';
import simplePriceReducer from './simplePrice';
import trendingCoinsReducer from './trendingCoins';

const rootReducer = combineReducers({
  coinList: coinListReducer,
  cryptoNews: cryptoNewsReducer,
  cryptoDetails: cryptoDetailsReducer,
  cryptoDetailsChart: cryptoDetailsChartReducer,
  cryptoMarketList: cryptoMarketListReducer,
  cryptoExchangesDetails: cryptoExchangesDetailsReducer,
  nftDashboard: nftDashboardReducer,
  nftDetails: nftDetailsReducer,
  employeeInfo: employeeInfoReducer,
  auth: authReducer,
  watchlist: watchlistReducer,
  globalMarketData: globalMarketDataReducer,
  simplePrice: simplePriceReducer,
  trendingCoins: trendingCoinsReducer,
});

export default rootReducer;
