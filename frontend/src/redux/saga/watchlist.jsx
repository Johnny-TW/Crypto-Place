import { takeLatest, call, put } from 'redux-saga/effects';
import { watchlistService } from '../../services/watchlistService';

// Action Creators
export const fetchWatchlistRequest = () => ({
  type: 'FETCH_WATCHLIST_REQUEST',
});

export const addToWatchlistRequest = coinData => ({
  type: 'ADD_TO_WATCHLIST_REQUEST',
  payload: coinData,
});

export const removeFromWatchlistRequest = coinId => ({
  type: 'REMOVE_FROM_WATCHLIST_REQUEST',
  payload: coinId,
});

export const checkWatchlistStatusRequest = coinId => ({
  type: 'CHECK_WATCHLIST_STATUS_REQUEST',
  payload: coinId,
});

export const checkBatchWatchlistStatusRequest = coinIds => ({
  type: 'CHECK_BATCH_WATCHLIST_STATUS_REQUEST',
  payload: coinIds,
});

export const getWatchlistCountRequest = () => ({
  type: 'GET_WATCHLIST_COUNT_REQUEST',
});

// Saga Functions
function* fetchWatchlistSaga() {
  try {
    yield put({ type: 'SET_WATCHLIST_LOADING', payload: true });

    const data = yield call(watchlistService.getUserWatchlist);

    yield put({
      type: 'FETCH_WATCHLIST_SUCCESS',
      payload: data,
    });
  } catch (error) {
    yield put({
      type: 'FETCH_WATCHLIST_FAILURE',
      payload: error.message || 'Failed to fetch watchlist',
    });
  } finally {
    yield put({ type: 'SET_WATCHLIST_LOADING', payload: false });
  }
}

function* addToWatchlistSaga(action) {
  try {
    yield put({ type: 'SET_WATCHLIST_LOADING', payload: true });

    const result = yield call(watchlistService.addToWatchlist, action.payload);

    yield put({
      type: 'ADD_TO_WATCHLIST_SUCCESS',
      payload: { coinData: action.payload, result },
    });

    // 移除重複請求，直接更新本地狀態即可
  } catch (error) {
    yield put({
      type: 'ADD_TO_WATCHLIST_FAILURE',
      payload: error.message || 'Failed to add to watchlist',
    });
  } finally {
    yield put({ type: 'SET_WATCHLIST_LOADING', payload: false });
  }
}

function* removeFromWatchlistSaga(action) {
  try {
    yield put({ type: 'SET_WATCHLIST_LOADING', payload: true });

    yield call(watchlistService.removeFromWatchlist, action.payload);

    yield put({
      type: 'REMOVE_FROM_WATCHLIST_SUCCESS',
      payload: action.payload,
    });

    // 移除重複請求，直接更新本地狀態即可
  } catch (error) {
    yield put({
      type: 'REMOVE_FROM_WATCHLIST_FAILURE',
      payload: error.message || 'Failed to remove from watchlist',
    });
  } finally {
    yield put({ type: 'SET_WATCHLIST_LOADING', payload: false });
  }
}

function* checkWatchlistStatusSaga(action) {
  try {
    const isInWatchlist = yield call(
      watchlistService.checkIsInWatchlist,
      action.payload
    );

    yield put({
      type: 'CHECK_WATCHLIST_STATUS_SUCCESS',
      payload: { coinId: action.payload, isInWatchlist },
    });
  } catch (error) {
    yield put({
      type: 'CHECK_WATCHLIST_STATUS_FAILURE',
      payload: error.message || 'Failed to check watchlist status',
    });
  }
}

function* checkBatchWatchlistStatusSaga(action) {
  try {
    const statusMap = yield call(
      watchlistService.checkBatchInWatchlist,
      action.payload
    );

    yield put({
      type: 'CHECK_BATCH_WATCHLIST_STATUS_SUCCESS',
      payload: statusMap,
    });
  } catch (error) {
    yield put({
      type: 'CHECK_BATCH_WATCHLIST_STATUS_FAILURE',
      payload: error.message || 'Failed to check batch watchlist status',
    });
  }
}

function* getWatchlistCountSaga() {
  try {
    const count = yield call(watchlistService.getWatchlistCount);

    yield put({
      type: 'GET_WATCHLIST_COUNT_SUCCESS',
      payload: count,
    });
  } catch (error) {
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
