import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { CRYPTO_DETAILS } from '../api/api';
import { BaseAction } from '../../types/redux';

interface FetchCryptoDetailsAction extends BaseAction {
  type: 'FETCH_CRYPTO_DETAILS';
  payload: { coinId: string };
}

export const fetchCryptoDetails = (
  coinId: string
): FetchCryptoDetailsAction => ({
  type: 'FETCH_CRYPTO_DETAILS',
  payload: { coinId },
});

function* fetchCryptoDetailsSaga(action: FetchCryptoDetailsAction): Generator {
  try {
    yield put({ type: 'FETCH_CRYPTO_DETAILS_REQUEST' });

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
  } catch (error: any) {
    yield put({ type: 'FETCH_CRYPTO_DETAILS_FAILURE', error: error.message });
  }
}

function* mySaga() {
  yield takeLatest('FETCH_CRYPTO_DETAILS', fetchCryptoDetailsSaga);
}

export default mySaga;
