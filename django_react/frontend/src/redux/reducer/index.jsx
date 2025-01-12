import coinListReducer from './cryptoDashboard';
import cryptoNewsReducer from './cryptoNews';

const reducer = (state = {}, action = '') => (
  {
    coinList: coinListReducer(state.coinList, action),
    cryptoNews: cryptoNewsReducer(state.cryptoNews, action),
  }
);

export default reducer;