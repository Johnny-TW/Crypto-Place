import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { CRYPTO_MARKET_LIST } from '../api/api';

// Action Creator
export const fetchCryptoMarketList = () => ({
  type: 'FETCH_MARKET_LIST_REQUEST',
});

// Saga
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
    console.log('Market data response:', response.data); // 日誌響應數據
    yield put({ type: 'FETCH_MARKET_LIST_SUCCESS', payload: response.data });
  } catch (error) {
    console.error('Error fetching market data:', error); // 日誌錯誤
    yield put({ type: 'FETCH_MARKET_LIST_FAILURE', error: error.message });
  }
}

// Root Saga
function* marketListSaga() {
  yield takeLatest('FETCH_MARKET_LIST_REQUEST', fetchMarketListSaga);
}

export default marketListSaga;
