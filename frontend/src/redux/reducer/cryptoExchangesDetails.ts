import { CryptoExchangesDetailsState, BaseAction } from '../../types/redux';

const initialState: CryptoExchangesDetailsState = {
  data: null,
  loading: false,
  error: null,
};

const exchangeDetailsReducer = (
  state: CryptoExchangesDetailsState = initialState,
  action: BaseAction
): CryptoExchangesDetailsState => {
  switch (action.type) {
    case 'FETCH_EXCHANGE_DETAILS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_EXCHANGE_DETAILS_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case 'FETCH_EXCHANGE_DETAILS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default exchangeDetailsReducer;
