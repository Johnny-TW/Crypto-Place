const initialState = {
  nftList: [],
  loading: false,
  error: null,
};

const nftDashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_NFT_LIST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_NFT_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        nftList: action.payload,
        error: null,
      };
    case 'FETCH_NFT_LIST_FAILURE':
      return {
        ...state,
        loading: false,
        nftList: [],
        error: action.error,
      };
    default:
      return state;
  }
};

export default nftDashboardReducer;
