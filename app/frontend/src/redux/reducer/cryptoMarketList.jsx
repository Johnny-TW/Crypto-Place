const initialState = {
  marketListData: null,
  loading: false,
  error: null,
};

const cryptoMarketReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CRYPTO_MARKET_LIST':
    case 'FETCH_MARKET_LIST_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_MARKET_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        marketListData: action.payload || [],
      };
    case 'FETCH_MARKET_LIST_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default cryptoMarketReducer;
