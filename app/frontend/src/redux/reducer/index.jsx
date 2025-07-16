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

const reducer = (state = {}, action = '') => ({
  coinList: coinListReducer(state.coinList, action),
  cryptoNews: cryptoNewsReducer(state.cryptoNews, action),
  cryptoDetails: cryptoDetailsReducer(state.cryptoDetails, action),
  cryptoDetailsChart: cryptoDetailsChartReducer(
    state.cryptoDetailsChart,
    action
  ),
  cryptoMarketList: cryptoMarketListReducer(state.cryptoMarketList, action),
  cryptoExchangesDetails: cryptoExchangesDetailsReducer(
    state.cryptoExchangesDetails,
    action
  ),
  nftDashboard: nftDashboardReducer(state.nftDashboard, action),
  nftDetails: nftDetailsReducer(state.nftDetails, action),
  employeeInfo: employeeInfoReducer(state.employeeInfo, action),
  auth: authReducer(state.auth, action),
});

export default reducer;
