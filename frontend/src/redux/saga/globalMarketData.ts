import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { GLOBAL_MARKET_DATA } from '../api/api';

function* fetchGlobalMarketDataSaga(): Generator {
  try {
    const options = {
      headers: {
        accept: 'application/json',
      },
    };

    const response: any = yield call(axios.get, GLOBAL_MARKET_DATA, options);
    yield put({
      type: 'FETCH_GLOBAL_MARKET_DATA_SUCCESS',
      payload: response.data,
    });
  } catch (error: any) {
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
