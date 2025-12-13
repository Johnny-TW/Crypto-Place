import { takeLatest, call, put } from 'redux-saga/effects';
import { call as apiCall, API_METHOD } from '../api/apiService';
import Cookies from 'js-cookie';
import { WATCHLIST, WATCHLIST_COUNT } from '../api/api';
import { BaseAction } from '../../types/redux';

// 創建認證配置的輔助函數
const getAuthConfig = () => {
  const token = Cookies.get('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  };
};

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

    const response: any = yield call(apiCall, {
      method: API_METHOD.GET,
      path: WATCHLIST,
      params: getAuthConfig(),
    });

    yield put({
      type: 'FETCH_WATCHLIST_SUCCESS',
      payload: response.data,
    });
  } catch (error: any) {
    // Ignore cancelled requests
    if (error.message === 'Cancel') {
      return;
    }
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

    const response: any = yield call(apiCall, {
      method: API_METHOD.POST,
      path: WATCHLIST,
      data: action.payload,
      params: getAuthConfig(),
    });

    yield put({
      type: 'ADD_TO_WATCHLIST_SUCCESS',
      payload: { coinData: action.payload, result: response.data },
    });

    // 移除重複請求，直接更新本地狀態即可
  } catch (error: any) {
    // Ignore cancelled requests
    if (error.message === 'Cancel') {
      return;
    }

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

    yield call(apiCall, {
      method: API_METHOD.DELETE,
      path: `${WATCHLIST}/${action.payload}`,
      params: getAuthConfig(),
    });

    yield put({
      type: 'REMOVE_FROM_WATCHLIST_SUCCESS',
      payload: action.payload,
    });

    // 移除重複請求，直接更新本地狀態即可
  } catch (error: any) {
    // Ignore cancelled requests
    if (error.message === 'Cancel') {
      return;
    }
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
    const response: any = yield call(apiCall, {
      method: API_METHOD.GET,
      path: `${WATCHLIST}/check/${action.payload}`,
      params: getAuthConfig(),
    });

    yield put({
      type: 'CHECK_WATCHLIST_STATUS_SUCCESS',
      payload: {
        coinId: action.payload,
        isInWatchlist: response.data.isInWatchlist,
      },
    });
  } catch (error: any) {
    // Ignore cancelled requests
    if (error.message === 'Cancel') {
      return;
    }

    // 如果是認證錯誤，返回 false
    if (error.response?.status === 401) {
      yield put({
        type: 'CHECK_WATCHLIST_STATUS_SUCCESS',
        payload: { coinId: action.payload, isInWatchlist: false },
      });
    } else {
      yield put({
        type: 'CHECK_WATCHLIST_STATUS_FAILURE',
        payload: error.message || 'Failed to check watchlist status',
      });
    }
  }
}

function* checkBatchWatchlistStatusSaga(
  action: CheckBatchWatchlistStatusAction
): Generator {
  try {
    if (!Array.isArray(action.payload) || action.payload.length === 0) {
      yield put({
        type: 'CHECK_BATCH_WATCHLIST_STATUS_SUCCESS',
        payload: {},
      });
      return;
    }

    const response: any = yield call(apiCall, {
      method: API_METHOD.POST,
      path: `${WATCHLIST}/check-batch`,
      data: { coinIds: action.payload },
      params: getAuthConfig(),
    });

    yield put({
      type: 'CHECK_BATCH_WATCHLIST_STATUS_SUCCESS',
      payload: response.data,
    });
  } catch (error: any) {
    // Ignore cancelled requests
    if (error.message === 'Cancel') {
      return;
    }

    // 如果是認證錯誤，返回空對象
    if (error.response?.status === 401) {
      const emptyStatusMap = action.payload.reduce(
        (acc: any, coinId: string) => ({
          ...acc,
          [coinId]: false,
        }),
        {}
      );
      yield put({
        type: 'CHECK_BATCH_WATCHLIST_STATUS_SUCCESS',
        payload: emptyStatusMap,
      });
    } else {
      yield put({
        type: 'CHECK_BATCH_WATCHLIST_STATUS_FAILURE',
        payload: error.message || 'Failed to check batch watchlist status',
      });
    }
  }
}

function* getWatchlistCountSaga(): Generator {
  try {
    const response: any = yield call(apiCall, {
      method: API_METHOD.GET,
      path: WATCHLIST_COUNT,
      params: getAuthConfig(),
    });

    yield put({
      type: 'GET_WATCHLIST_COUNT_SUCCESS',
      payload: response.data.count,
    });
  } catch (error: any) {
    // Ignore cancelled requests
    if (error.message === 'Cancel') {
      return;
    }
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
