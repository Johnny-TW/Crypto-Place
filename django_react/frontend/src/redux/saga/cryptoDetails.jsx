import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { CRYPTO_DETAILS } from '../api/api';

// Action Creator
export const fetchCryptoDetails = (coinId) => ({
  type: 'FETCH_CRYPTO_DETAILS',
  payload: { coinId }
});

// Saga
function* fetchCryptoDetailsSaga(action) {
  try {
    const options = {
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-nrJXAB28gG2xbfsdLieGcxWB'
      }
    };

    const response = yield call(
      axios.get,
      `${CRYPTO_DETAILS}/${action.payload.coinId}`,
      options
    );
    yield put({ type: 'FETCH_CRYPTO_DETAILS_SUCCESS', payload: response.data });
  } catch (error) {
    yield put({ type: 'FETCH_CRYPTO_DETAILS_FAILURE', error: error.message });
  }
}

// Root Saga
function* cryptoDetailsSaga() {
  yield takeLatest('FETCH_CRYPTO_DETAILS', fetchCryptoDetailsSaga);
}

export default cryptoDetailsSaga;