import { takeLatest, call, put } from 'redux-saga/effects';
import { call as apiCall, API_METHOD } from '../api/apiService';
import { TRENDING_COINS } from '../api/api';

function* fetchTrendingCoinsSaga(): Generator {
  try {
    const response: any = yield call(apiCall, {
      method: API_METHOD.GET,
      path: TRENDING_COINS,
      params: {
        headers: {
          accept: 'application/json',
        },
      },
    });

    yield put({
      type: 'FETCH_TRENDING_COINS_SUCCESS',
      payload: response.data,
    });
  } catch (error: any) {
    // Ignore cancelled requests
    if (error.message === 'Cancel') {
      return;
    }
    yield put({
      type: 'FETCH_TRENDING_COINS_FAILURE',
      error: error.message || '獲取熱門幣種失敗',
    });
  }
}

function* trendingCoinsSaga() {
  yield takeLatest('FETCH_TRENDING_COINS', fetchTrendingCoinsSaga);
}

export default trendingCoinsSaga;
