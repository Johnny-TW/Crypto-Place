import coinListReducer from './cryptoDashboard';
import cryptoNewsReducer from './cryptoNews';
import cryptoDetailsReducer from './cryptoDetails';
import cryptoDetailsChartReducer from './cryptoCoinChart';
import cryptoMarketListReducer from './cryptoMarketList';
import cryptoExchangesDetailsReducer from './cryptoExchangesDetails';

const reducer = (state = {}, action = '') => (
  {
    coinList: coinListReducer(state.coinList, action),
    cryptoNews: cryptoNewsReducer(state.cryptoNews, action),
    cryptoDetails: cryptoDetailsReducer(state.cryptoDetails, action),
    cryptoDetailsChart: cryptoDetailsChartReducer(state.cryptoDetailsChart, action),
    cryptoMarketList: cryptoMarketListReducer(state.cryptoMarketList, action),
    cryptoExchangesDetails: cryptoExchangesDetailsReducer(state.cryptoExchangesDetails, action),
  }
);

export default reducer;
