import { takeLatest, call, put } from 'redux-saga/effects';
import { call as apiCall, API_METHOD } from '../api/apiService';
import { GLOBAL_MARKET_DATA } from '../api/api';

function* fetchGlobalMarketDataSaga(): Generator {
  try {
    const response: any = yield call(apiCall, {
      method: API_METHOD.GET,
      path: GLOBAL_MARKET_DATA,
      params: {
        headers: {
          accept: 'application/json',
        },
      },
    });
    yield put({
      type: 'FETCH_GLOBAL_MARKET_DATA_SUCCESS',
      payload: response.data,
    });
  } catch (error: any) {
    // Ignore cancelled requests
    if (error.message === 'Cancel') {
      return;
    }
    yield put({
      type: 'FETCH_GLOBAL_MARKET_DATA_FAILURE',
      error: error.message,
    });
  }
}

function* globalMarketDataSaga() {
  yield takeLatest('FETCH_GLOBAL_MARKET_DATA', fetchGlobalMarketDataSaga);
}

export default globalMarketDataSaga;
