const initialState = {
  exchangeDetails: null,
  loading: false,
  error: null,
};

const exchangeDetailsReducer = (state = initialState, action) => {
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
        exchangeDetails: action.payload,
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
