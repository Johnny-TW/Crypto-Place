const initialState = {
  watchlist: [],
  isLoading: false,
  error: null,
  count: 0,
  statusMap: {}, // 用於存儲批量檢查的狀態 { coinId: boolean }
};

const watchlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_WATCHLIST_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        error: null,
      };

    case 'FETCH_WATCHLIST_SUCCESS':
      return {
        ...state,
        watchlist: action.payload,
        error: null,
        count: action.payload.length,
      };

    case 'FETCH_WATCHLIST_FAILURE':
      return {
        ...state,
        error: action.payload,
        watchlist: [],
      };

    case 'ADD_TO_WATCHLIST_SUCCESS':
      return {
        ...state,
        error: null,
        // 更新狀態映射
        statusMap: {
          ...state.statusMap,
          [action.payload.coinData.coinId]: true,
        },
      };

    case 'ADD_TO_WATCHLIST_FAILURE':
      return {
        ...state,
        error: action.payload,
      };

    case 'REMOVE_FROM_WATCHLIST_SUCCESS':
      return {
        ...state,
        error: null,
        // 從狀態映射中移除
        statusMap: {
          ...state.statusMap,
          [action.payload]: false,
        },
      };

    case 'REMOVE_FROM_WATCHLIST_FAILURE':
      return {
        ...state,
        error: action.payload,
      };

    case 'CHECK_WATCHLIST_STATUS_SUCCESS':
      return {
        ...state,
        statusMap: {
          ...state.statusMap,
          [action.payload.coinId]: action.payload.isInWatchlist,
        },
      };

    case 'CHECK_WATCHLIST_STATUS_FAILURE':
      return {
        ...state,
        error: action.payload,
      };

    case 'CHECK_BATCH_WATCHLIST_STATUS_SUCCESS':
      return {
        ...state,
        statusMap: {
          ...state.statusMap,
          ...action.payload,
        },
      };

    case 'CHECK_BATCH_WATCHLIST_STATUS_FAILURE':
      return {
        ...state,
        error: action.payload,
      };

    case 'GET_WATCHLIST_COUNT_SUCCESS':
      return {
        ...state,
        count: action.payload,
      };

    case 'GET_WATCHLIST_COUNT_FAILURE':
      return {
        ...state,
        error: action.payload,
      };

    case 'CLEAR_WATCHLIST_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default watchlistReducer;
