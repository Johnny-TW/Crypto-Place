import { CryptoState, BaseAction } from '../../types/redux';

const initialState: CryptoState = {
  coinList: [],
  loading: false,
  error: null,
};

const coinListReducer = (
  state: CryptoState = initialState,
  action: BaseAction
): CryptoState => {
  switch (action.type) {
    case 'FETCH_COIN_LIST':
      return { ...state, loading: true, error: null };
    case 'FETCH_COIN_LIST_SUCCESS':
      return { ...state, loading: false, coinList: action.payload };
    case 'FETCH_COIN_LIST_FAILURE':
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default coinListReducer;
