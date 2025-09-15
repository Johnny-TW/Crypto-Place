import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';

export const useWatchlist = () => {
  const dispatch = useDispatch();
  const watchlistState = useSelector(state => state.watchlist);

  // Actions
  const actions = {
    // 獲取完整最愛列表
    fetchWatchlist: useCallback(() => {
      dispatch({ type: 'FETCH_WATCHLIST_REQUEST' });
    }, [dispatch]),

    // 新增到最愛
    addToWatchlist: useCallback(
      coinData => {
        dispatch({ type: 'ADD_TO_WATCHLIST_REQUEST', payload: coinData });
      },
      [dispatch]
    ),

    // 從最愛移除
    removeFromWatchlist: useCallback(
      coinId => {
        dispatch({ type: 'REMOVE_FROM_WATCHLIST_REQUEST', payload: coinId });
      },
      [dispatch]
    ),

    // 檢查單一幣種狀態
    checkStatus: useCallback(
      coinId => {
        dispatch({ type: 'CHECK_WATCHLIST_STATUS_REQUEST', payload: coinId });
      },
      [dispatch]
    ),

    // 批量檢查多個幣種狀態 - 用於列表頁面性能優化
    checkBatchStatus: useCallback(
      coinIds => {
        if (Array.isArray(coinIds) && coinIds.length > 0) {
          dispatch({
            type: 'CHECK_BATCH_WATCHLIST_STATUS_REQUEST',
            payload: coinIds,
          });
        }
      },
      [dispatch]
    ),

    // 獲取最愛數量
    getCount: useCallback(() => {
      dispatch({ type: 'GET_WATCHLIST_COUNT_REQUEST' });
    }, [dispatch]),
  };

  // Utilities
  const utils = {
    // 檢查特定幣種是否在最愛中
    isCoinFavorite: useCallback(
      coinId => {
        return watchlistState.statusMap
          ? (watchlistState.statusMap[coinId] ?? false)
          : false;
      },
      [watchlistState.statusMap]
    ),

    // 獲取已載入的收藏狀態對照表
    getFavoriteStatusMap: useCallback(() => {
      return watchlistState.statusMap || {};
    }, [watchlistState.statusMap]),

    // 檢查是否需要批量載入狀態（用於列表頁面優化）
    shouldLoadBatchStatus: useCallback(
      coinIds => {
        // 確保 statusMap 存在，如果不存在則返回 true 表示需要載入
        if (!watchlistState.statusMap) {
          return true;
        }
        return coinIds.some(
          coinId => watchlistState.statusMap[coinId] === undefined
        );
      },
      [watchlistState.statusMap]
    ),
  };

  return {
    // State
    ...watchlistState,

    // Actions
    ...actions,

    // Utilities
    ...utils,
  };
};

export default useWatchlist;
