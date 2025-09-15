import { takeLatest, put, call } from 'redux-saga/effects';
import axios from 'axios';
import { API_METHOD } from '../api/apiService';
import { CRYPTO_DETAILS_CHART } from '../api/api';
import { BaseAction } from '../../types/redux';

interface FetchCryptoChartAction extends BaseAction {
  type: 'FETCH_CRYPTO_CHART' | 'FETCH_CRYPTO_CHART_REQUEST';
  payload: { coinId: string; timeRange: string };
}

export const fetchCryptoChart = (
  coinId: string,
  timeRange: string
): FetchCryptoChartAction => ({
  type: 'FETCH_CRYPTO_CHART_REQUEST',
  payload: { coinId, timeRange },
});

const convertRangeToDays = (range: string): number => {
  switch (range) {
    case '24h':
      return 1;
    case '7d':
      return 7;
    case '30d':
      return 30;
    case '1y':
      return 365;
    default:
      return 1;
  }
};

function* fetchCryptoChartSaga(action: FetchCryptoChartAction): Generator {
  try {
    yield put({ type: 'FETCH_CRYPTO_CHART_REQUEST' });

    const { coinId, timeRange } = action.payload;
    const days = convertRangeToDays(timeRange);
    const options = {
      method: API_METHOD.GET,
      url: CRYPTO_DETAILS_CHART.replace('bitcoin', coinId),
      params: {
        vs_currency: 'usd',
        days,
        interval: 'daily',
        precision: '18',
      },
      headers: {
        accept: 'application/json',
      },
    };

    const response = yield call(axios.request, options);
    yield put({
      type: 'FETCH_CRYPTO_CHART_SUCCESS',
      payload: response.data,
    });
  } catch (error: any) {
    yield put({
      type: 'FETCH_CRYPTO_CHART_FAILURE',
      payload: error.message,
    });
  }
}

function* cryptoChartSaga() {
  yield takeLatest('FETCH_CRYPTO_CHART', fetchCryptoChartSaga);
}

export default cryptoChartSaga;
