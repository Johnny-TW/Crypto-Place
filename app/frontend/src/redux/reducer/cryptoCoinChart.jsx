const initialState = {
  chartData: null,
  loading: false,
  error: null,
};

const cryptoCoinChartReducer = (state = initialState, action) => {
  switch (action.type) {
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
        chartData: action.payload,
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
