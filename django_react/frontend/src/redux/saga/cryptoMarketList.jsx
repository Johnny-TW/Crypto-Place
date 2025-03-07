import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { CRYPTO_MARKET_LIST } from '../api/api';

export const fetchCryptoMarketList = () => ({
  type: 'FETCH_MARKET_LIST_REQUEST',
});

function* fetchMarketListSaga() {
  try {
    const options = {
      method: 'GET',
      url: CRYPTO_MARKET_LIST,
      params: {
        per_page: '250',
      },
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-nrJXAB28gG2xbfsdLieGcxWB',
      },
    };

    const response = yield call(axios.request, options);
    console.log('Market data response:', response.data);
    yield put({ type: 'FETCH_MARKET_LIST_SUCCESS', payload: response.data });
  } catch (error) {
    console.error('Error fetching market data:', error);
    yield put({ type: 'FETCH_MARKET_LIST_FAILURE', error: error.message });
  }
}

function* marketListSaga() {
  yield takeLatest('FETCH_MARKET_LIST_REQUEST', fetchMarketListSaga);
}

export default marketListSaga;
