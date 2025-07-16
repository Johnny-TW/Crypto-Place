import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { API_METHOD } from '../api/apiService';
import { CRYPTO_MARKET_LIST } from '../api/api';

export const fetchCryptoMarketList = () => ({
  type: 'FETCH_MARKET_LIST_REQUEST',
});

function* fetchMarketListSaga() {
  try {
    yield put({ type: 'FETCH_MARKET_LIST_REQUEST' });

    const options = {
      method: API_METHOD.GET,
      url: CRYPTO_MARKET_LIST,
      params: {
        per_page: '250',
      },
      headers: {
        accept: 'application/json',
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
  yield takeLatest('FETCH_CRYPTO_MARKET_LIST', fetchMarketListSaga);
}

export default marketListSaga;
