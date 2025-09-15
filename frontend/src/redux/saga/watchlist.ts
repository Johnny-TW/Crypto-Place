import { takeLatest, call, put } from 'redux-saga/effects';
import { watchlistService } from '../../services/watchlistService';
import { BaseAction } from '../../types/redux';

// Action Types
interface FetchWatchlistAction extends BaseAction {
  type: 'FETCH_WATCHLIST_REQUEST';
}

interface AddToWatchlistAction extends BaseAction {
  type: 'ADD_TO_WATCHLIST_REQUEST';
  payload: any;
}

interface RemoveFromWatchlistAction extends BaseAction {
  type: 'REMOVE_FROM_WATCHLIST_REQUEST';
  payload: string;
}

interface CheckWatchlistStatusAction extends BaseAction {
  type: 'CHECK_WATCHLIST_STATUS_REQUEST';
  payload: string;
}

interface CheckBatchWatchlistStatusAction extends BaseAction {
  type: 'CHECK_BATCH_WATCHLIST_STATUS_REQUEST';
  payload: string[];
}

// Action Creators
export const fetchWatchlistRequest = (): FetchWatchlistAction => ({
  type: 'FETCH_WATCHLIST_REQUEST',
});

export const addToWatchlistRequest = (coinData: any): AddToWatchlistAction => ({
  type: 'ADD_TO_WATCHLIST_REQUEST',
  payload: coinData,
});

export const removeFromWatchlistRequest = (
  coinId: string
): RemoveFromWatchlistAction => ({
  type: 'REMOVE_FROM_WATCHLIST_REQUEST',
  payload: coinId,
});

export const checkWatchlistStatusRequest = (
  coinId: string
): CheckWatchlistStatusAction => ({
  type: 'CHECK_WATCHLIST_STATUS_REQUEST',
  payload: coinId,
});

export const checkBatchWatchlistStatusRequest = (
  coinIds: string[]
): CheckBatchWatchlistStatusAction => ({
  type: 'CHECK_BATCH_WATCHLIST_STATUS_REQUEST',
  payload: coinIds,
});

interface GetWatchlistCountAction extends BaseAction {
  type: 'GET_WATCHLIST_COUNT_REQUEST';
}

export const getWatchlistCountRequest = (): GetWatchlistCountAction => ({
  type: 'GET_WATCHLIST_COUNT_REQUEST',
});

// Saga Functions
function* fetchWatchlistSaga(): Generator {
  try {
    yield put({ type: 'SET_WATCHLIST_LOADING', payload: true });

    const data = yield call(watchlistService.getUserWatchlist);

    yield put({
      type: 'FETCH_WATCHLIST_SUCCESS',
      payload: data,
    });
  } catch (error: any) {
    yield put({
      type: 'FETCH_WATCHLIST_FAILURE',
      payload: error.message || 'Failed to fetch watchlist',
    });
  } finally {
    yield put({ type: 'SET_WATCHLIST_LOADING', payload: false });
  }
}

function* addToWatchlistSaga(action: AddToWatchlistAction): Generator {
  try {
    yield put({ type: 'SET_WATCHLIST_LOADING', payload: true });

    const result = yield call(watchlistService.addToWatchlist, action.payload);

    yield put({
      type: 'ADD_TO_WATCHLIST_SUCCESS',
      payload: { coinData: action.payload, result },
    });

    // 移除重複請求，直接更新本地狀態即可
  } catch (error: any) {
    // 檢查是否為 409 Conflict 錯誤（已經在最愛列表中）
    if (error.response && error.response.status === 409) {
      // 如果是衝突錯誤，我們視為成功並更新本地狀態
      yield put({
        type: 'ADD_TO_WATCHLIST_SUCCESS',
        payload: { coinData: action.payload, result: null },
      });

      // 同時顯示友好提示
      yield put({
        type: 'SET_NOTIFICATION',
        payload: {
          type: 'info',
          message: '此幣種已在您的最愛列表中',
        },
      });
    } else {
      yield put({
        type: 'ADD_TO_WATCHLIST_FAILURE',
        payload: error.message || 'Failed to add to watchlist',
      });
    }
  } finally {
    yield put({ type: 'SET_WATCHLIST_LOADING', payload: false });
  }
}

function* removeFromWatchlistSaga(
  action: RemoveFromWatchlistAction
): Generator {
  try {
    yield put({ type: 'SET_WATCHLIST_LOADING', payload: true });

    yield call(watchlistService.removeFromWatchlist, action.payload);

    yield put({
      type: 'REMOVE_FROM_WATCHLIST_SUCCESS',
      payload: action.payload,
    });

    // 移除重複請求，直接更新本地狀態即可
  } catch (error: any) {
    yield put({
      type: 'REMOVE_FROM_WATCHLIST_FAILURE',
      payload: error.message || 'Failed to remove from watchlist',
    });
  } finally {
    yield put({ type: 'SET_WATCHLIST_LOADING', payload: false });
  }
}

function* checkWatchlistStatusSaga(
  action: CheckWatchlistStatusAction
): Generator {
  try {
    const isInWatchlist = yield call(
      watchlistService.checkIsInWatchlist,
      action.payload
    );

    yield put({
      type: 'CHECK_WATCHLIST_STATUS_SUCCESS',
      payload: { coinId: action.payload, isInWatchlist },
    });
  } catch (error: any) {
    yield put({
      type: 'CHECK_WATCHLIST_STATUS_FAILURE',
      payload: error.message || 'Failed to check watchlist status',
    });
  }
}

function* checkBatchWatchlistStatusSaga(
  action: CheckBatchWatchlistStatusAction
): Generator {
  try {
    const statusMap = yield call(
      watchlistService.checkBatchInWatchlist,
      action.payload
    );

    yield put({
      type: 'CHECK_BATCH_WATCHLIST_STATUS_SUCCESS',
      payload: statusMap,
    });
  } catch (error: any) {
    yield put({
      type: 'CHECK_BATCH_WATCHLIST_STATUS_FAILURE',
      payload: error.message || 'Failed to check batch watchlist status',
    });
  }
}

function* getWatchlistCountSaga(): Generator {
  try {
    const count = yield call(watchlistService.getWatchlistCount);

    yield put({
      type: 'GET_WATCHLIST_COUNT_SUCCESS',
      payload: count,
    });
  } catch (error: any) {
    yield put({
      type: 'GET_WATCHLIST_COUNT_FAILURE',
      payload: error.message || 'Failed to get watchlist count',
    });
  }
}

// Watcher Saga
export function* watchlistSaga() {
  yield takeLatest('FETCH_WATCHLIST_REQUEST', fetchWatchlistSaga);
  yield takeLatest('ADD_TO_WATCHLIST_REQUEST', addToWatchlistSaga);
  yield takeLatest('REMOVE_FROM_WATCHLIST_REQUEST', removeFromWatchlistSaga);
  yield takeLatest('CHECK_WATCHLIST_STATUS_REQUEST', checkWatchlistStatusSaga);
  yield takeLatest(
    'CHECK_BATCH_WATCHLIST_STATUS_REQUEST',
    checkBatchWatchlistStatusSaga
  );
  yield takeLatest('GET_WATCHLIST_COUNT_REQUEST', getWatchlistCountSaga);
}
