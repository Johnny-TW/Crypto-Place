import coinListReducer from './cryptoDashboard';

const reducer = (state = {}, action = '') => (
  {
    coinList: coinListReducer(state.coinList, action),
  }
);

export default reducer;