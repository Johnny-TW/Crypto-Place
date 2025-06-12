import { takeLatest, put, call } from 'redux-saga/effects';
import axios from 'axios';
import { CRYPTO_DETAILS_CHART } from '../api/api';

export const fetchCryptoChart = (coinId, timeRange) => ({
  type: 'FETCH_CRYPTO_CHART_REQUEST',
  payload: { coinId, timeRange },
});

function* fetchCryptoChartSaga(action) {
  try {
    const { coinId, timeRange } = action.payload;
    const options = {
      method: 'GET',
      url: CRYPTO_DETAILS_CHART.replace('bitcoin', coinId),
      params: {
        vs_currency: 'usd',
        days: timeRange,
        interval: 'daily',
        precision: '18',
      },
      headers: {
        accept: 'application/json',
        // 'x-cg-demo-api-key': 'CG-nrJXAB28gG2xbfsdLieGcxWB',
      },
    };

    const response = yield call(axios.request, options);
    yield put({
      type: 'FETCH_CRYPTO_CHART_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: 'FETCH_CRYPTO_CHART_FAILURE',
      payload: error.message,
    });
  }
}

function* cryptoChartSaga() {
  yield takeLatest('FETCH_CRYPTO_CHART_REQUEST', fetchCryptoChartSaga);
}

export default cryptoChartSaga;
