import coinListReducer from './cryptoDashboard';
import cryptoNewsReducer from './cryptoNews';
import cryptoDetailsReducer from './cryptoDetails';

const reducer = (state = {}, action = '') => (
  {
    coinList: coinListReducer(state.coinList, action),
    cryptoNews: cryptoNewsReducer(state.cryptoNews, action),
    cryptoDetails: cryptoDetailsReducer(state.cryptoDetails, action),
  }
);

export default reducer;