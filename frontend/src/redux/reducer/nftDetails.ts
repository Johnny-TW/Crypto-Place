import { NFTDetailsState, BaseAction } from '../../types/redux';

const initialState: NFTDetailsState = {
  data: {
    nftData: {},
    newsData: [],
    newsLoading: false,
    newsError: null,
  },
  loading: false,
  error: null,
};

const nftDetailsReducer = (
  state: NFTDetailsState = initialState,
  action: BaseAction
): NFTDetailsState => {
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
        data: {
          ...state.data,
          nftData: action.payload,
        },
        error: null,
      };
    case 'FETCH_NFT_DETAILS_FAILURE':
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          nftData: {},
        },
        error: action.error,
      };
    case 'FETCH_NFT_NEWS':
      return {
        ...state,
        data: {
          ...state.data,
          newsLoading: true,
          newsError: null,
        },
      };
    case 'FETCH_NFT_NEWS_SUCCESS':
      return {
        ...state,
        data: {
          ...state.data,
          newsLoading: false,
          newsData: action.payload,
          newsError: null,
        },
      };
    case 'FETCH_NFT_NEWS_FAILURE':
      return {
        ...state,
        data: {
          ...state.data,
          newsLoading: false,
          newsData: [],
          newsError: action.error,
        },
      };
    default:
      return state;
  }
};

export default nftDetailsReducer;
