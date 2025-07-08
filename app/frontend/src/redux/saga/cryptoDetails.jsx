import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { CRYPTO_DETAILS } from '../api/api';

export const fetchCryptoDetails = coinId => ({
  type: 'FETCH_CRYPTO_DETAILS',
  payload: { coinId },
});

function* fetchCryptoDetailsSaga(action) {
  try {
    const options = {
      headers: {
        accept: 'application/json',
      },
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

function* mySaga() {
  yield takeLatest('FETCH_CRYPTO_DETAILS', fetchCryptoDetailsSaga);
}

export default mySaga;
