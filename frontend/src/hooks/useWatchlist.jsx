import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchWatchlistRequest,
  addToWatchlistRequest,
  removeFromWatchlistRequest,
  checkWatchlistStatusRequest,
  checkBatchWatchlistStatusRequest,
  getWatchlistCountRequest,
} from '../redux/saga/watchlist';

/**
 * Custom hook for watchlist operations
 * 提供完整的 watchlist 功能，包含批量操作和狀態管理
 */
export const useWatchlist = () => {
  const dispatch = useDispatch();
  const watchlistState = useSelector(state => state.watchlist);

  // Actions
  const actions = {
    // 獲取完整最愛列表
    fetchWatchlist: useCallback(() => {
      dispatch(fetchWatchlistRequest());
    }, [dispatch]),

    // 新增到最愛
    addToWatchlist: useCallback(
      coinData => {
        dispatch(addToWatchlistRequest(coinData));
      },
      [dispatch]
    ),

    // 從最愛移除
    removeFromWatchlist: useCallback(
      coinId => {
        dispatch(removeFromWatchlistRequest(coinId));
      },
      [dispatch]
    ),

    // 檢查單一幣種狀態
    checkStatus: useCallback(
      coinId => {
        dispatch(checkWatchlistStatusRequest(coinId));
      },
      [dispatch]
    ),

    // 批量檢查多個幣種狀態 - 用於列表頁面性能優化
    checkBatchStatus: useCallback(
      coinIds => {
        if (Array.isArray(coinIds) && coinIds.length > 0) {
          dispatch(checkBatchWatchlistStatusRequest(coinIds));
        }
      },
      [dispatch]
    ),

    // 獲取最愛數量
    getCount: useCallback(() => {
      dispatch(getWatchlistCountRequest());
    }, [dispatch]),
  };

  // Utilities
  const utils = {
    // 檢查特定幣種是否在最愛中
    isCoinFavorite: useCallback(
      coinId => {
        return watchlistState.statusMap[coinId] ?? false;
      },
      [watchlistState.statusMap]
    ),

    // 獲取已載入的收藏狀態對照表
    getFavoriteStatusMap: useCallback(() => {
      return watchlistState.statusMap;
    }, [watchlistState.statusMap]),

    // 檢查是否需要批量載入狀態（用於列表頁面優化）
    shouldLoadBatchStatus: useCallback(
      coinIds => {
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
