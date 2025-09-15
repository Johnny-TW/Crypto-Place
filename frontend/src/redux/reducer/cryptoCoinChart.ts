import { CryptoChartState, BaseAction } from '../../types/redux';

const initialState: CryptoChartState = {
  data: null,
  loading: false,
  error: null,
};

const cryptoCoinChartReducer = (
  state: CryptoChartState = initialState,
  action: BaseAction
): CryptoChartState => {
  switch (action.type) {
    case 'FETCH_CRYPTO_CHART':
    case 'FETCH_CRYPTO_CHART_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_CRYPTO_CHART_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case 'FETCH_CRYPTO_CHART_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default cryptoCoinChartReducer;
