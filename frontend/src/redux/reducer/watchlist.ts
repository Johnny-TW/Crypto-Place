import { WatchlistState, BaseAction } from '../../types/redux';

const initialState: WatchlistState = {
  data: [],
  loading: false,
  error: null,
  statusMap: {},
};

const watchlistReducer = (
  state: WatchlistState = initialState,
  action: BaseAction
): WatchlistState => {
  switch (action.type) {
    case 'SET_WATCHLIST_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: null,
      };

    case 'FETCH_WATCHLIST_SUCCESS':
      return {
        ...state,
        data: action.payload,
        error: null,
      };

    case 'FETCH_WATCHLIST_FAILURE':
      return {
        ...state,
        error: action.payload,
        data: [],
      };

    case 'ADD_TO_WATCHLIST_SUCCESS':
      // 添加成功後更新狀態映射
      return {
        ...state,
        error: null,
        statusMap: {
          ...state.statusMap,
          [action.payload.coinData.coinId]: true,
        },
      };

    case 'REMOVE_FROM_WATCHLIST_SUCCESS':
      // 移除成功後更新狀態映射
      return {
        ...state,
        error: null,
        statusMap: {
          ...state.statusMap,
          [action.payload]: false,
        },
      };

    case 'CHECK_WATCHLIST_STATUS_SUCCESS':
      // 更新單一幣種狀態
      return {
        ...state,
        error: null,
        statusMap: {
          ...state.statusMap,
          [action.payload.coinId]: action.payload.isInWatchlist,
        },
      };

    case 'CHECK_BATCH_WATCHLIST_STATUS_SUCCESS':
      // 批量更新狀態映射
      return {
        ...state,
        error: null,
        statusMap: {
          ...state.statusMap,
          ...action.payload,
        },
      };

    case 'GET_WATCHLIST_COUNT_SUCCESS':
    case 'CLEAR_WATCHLIST_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'ADD_TO_WATCHLIST_FAILURE':
    case 'REMOVE_FROM_WATCHLIST_FAILURE':
    case 'CHECK_WATCHLIST_STATUS_FAILURE':
    case 'CHECK_BATCH_WATCHLIST_STATUS_FAILURE':
    case 'GET_WATCHLIST_COUNT_FAILURE':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default watchlistReducer;
