const initialState = {
  nftData: {},
  newsData: [],
  loading: false,
  newsLoading: false,
  error: null,
  newsError: null,
};

const nftDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_NFT_DETAILS':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_NFT_DETAILS_SUCCESS':
      return {
        ...state,
        loading: false,
        nftData: action.payload,
        error: null,
      };
    case 'FETCH_NFT_DETAILS_FAILURE':
      return {
        ...state,
        loading: false,
        nftData: {},
        error: action.error,
      };
    case 'FETCH_NFT_NEWS':
      return {
        ...state,
        newsLoading: true,
        newsError: null,
      };
    case 'FETCH_NFT_NEWS_SUCCESS':
      return {
        ...state,
        newsLoading: false,
        newsData: action.payload,
        newsError: null,
      };
    case 'FETCH_NFT_NEWS_FAILURE':
      return {
        ...state,
        newsLoading: false,
        newsData: [],
        newsError: action.error,
      };
    default:
      return state;
  }
};

export default nftDetailsReducer;
