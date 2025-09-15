import { NFTState, BaseAction } from '../../types/redux';

const initialState: NFTState = {
  data: [],
  loading: false,
  error: null,
};

const nftDashboardReducer = (
  state: NFTState = initialState,
  action: BaseAction
): NFTState => {
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
        data: action.payload,
        error: null,
      };
    case 'FETCH_NFT_LIST_FAILURE':
      return {
        ...state,
        loading: false,
        data: [],
        error: action.error,
      };
    default:
      return state;
  }
};

export default nftDashboardReducer;
