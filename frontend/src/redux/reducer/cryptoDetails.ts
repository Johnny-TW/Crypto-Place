import { CryptoDetailsState, BaseAction } from '../../types/redux';

const initialState: CryptoDetailsState = {
  cryptoDetails: null,
  loading: false,
  error: null,
};

const cryptoDetailsReducer = (
  state: CryptoDetailsState = initialState,
  action: BaseAction
): CryptoDetailsState => {
  switch (action.type) {
    case 'FETCH_CRYPTO_DETAILS':
    case 'FETCH_CRYPTO_DETAILS_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_CRYPTO_DETAILS_SUCCESS':
      return { ...state, loading: false, cryptoDetails: action.payload };
    case 'FETCH_CRYPTO_DETAILS_FAILURE':
      return { ...state, loading: false, error: action.error };
    case 'FETCH_CRYPTO_DETAILS_RESET':
      return initialState;
    default:
      return state;
  }
};

export default cryptoDetailsReducer;
