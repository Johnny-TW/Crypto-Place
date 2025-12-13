import { takeLatest, call, put } from 'redux-saga/effects';
import { call as apiCall, API_METHOD } from '../api/apiService';
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

    const response: any = yield call(apiCall, {
      method: API_METHOD.GET,
      path: `${CRYPTO_DETAILS}/${action.payload.coinId}`,
      params: {
        headers: {
          accept: 'application/json',
        },
      },
    });
    yield put({ type: 'FETCH_CRYPTO_DETAILS_SUCCESS', payload: response.data });
  } catch (error: any) {
    // Ignore cancelled requests
    if (error.message === 'Cancel') {
      return;
    }
    yield put({ type: 'FETCH_CRYPTO_DETAILS_FAILURE', error: error.message });
  }
}

function* mySaga() {
  yield takeLatest('FETCH_CRYPTO_DETAILS', fetchCryptoDetailsSaga);
}

export default mySaga;
