import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { TRENDING_COINS } from '../api/api';

function* fetchTrendingCoinsSaga(): Generator {
  try {
    const options = {
      headers: {
        accept: 'application/json',
      },
    };

    const response: any = yield call(axios.get, TRENDING_COINS, options);

    yield put({
      type: 'FETCH_TRENDING_COINS_SUCCESS',
      payload: response.data,
    });
  } catch (error: any) {
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
