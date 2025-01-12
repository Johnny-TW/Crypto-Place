const FETCH_CRYPTO_NEWS_REQUEST = 'FETCH_CRYPTO_NEWS_REQUEST';
const FETCH_CRYPTO_NEWS_SUCCESS = 'FETCH_CRYPTO_NEWS_SUCCESS';
const FETCH_CRYPTO_NEWS_FAILURE = 'FETCH_CRYPTO_NEWS_FAILURE';

const initialState = {
  news: [],
  loading: false,
  error: null,
};

const cryptoNewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CRYPTO_NEWS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_CRYPTO_NEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        news: action.payload,
      };
    case FETCH_CRYPTO_NEWS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default cryptoNewsReducer;