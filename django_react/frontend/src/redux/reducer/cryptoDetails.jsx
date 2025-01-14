const initialState = {
  cryptoDetails: null,
  loading: false,
  error: null,
};

const cryptoDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CRYPTO_DETAILS':
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