import coinListReducer from './cryptoDashboard';
import cryptoNewsReducer from './cryptoNews';
import cryptoDetailsReducer from './cryptoDetails';
import cryptoDetailsChartReducer from './cryptoCoinChart';

const reducer = (state = {}, action = '') => (
  {
    coinList: coinListReducer(state.coinList, action),
    cryptoNews: cryptoNewsReducer(state.cryptoNews, action),
    cryptoDetails: cryptoDetailsReducer(state.cryptoDetails, action),
    cryptoDetailsChart: cryptoDetailsChartReducer(state.cryptoDetailsChart, action),
  }
);

export default reducer;
