import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';

function* fetchExchangeDetailsSaga(action) {
  try {
    const options = {
      method: 'GET',
      url: `https://api.coingecko.com/api/v3/exchanges/${action.payload}`,
      headers: {
        accept: 'application/json',
        // 'x-cg-demo-api-key': 'CG-nrJXAB28gG2xbfsdLieGcxWB',
      },
    };

    const response = yield call(axios.request, options);
    yield put({ type: 'FETCH_EXCHANGE_DETAILS_SUCCESS', payload: response.data });
  } catch (error) {
    yield put({ type: 'FETCH_EXCHANGE_DETAILS_FAILURE', payload: error.message });
  }
}

// Root Saga
function* exchangeDetailsSaga() {
  yield takeLatest('FETCH_EXCHANGE_DETAILS', fetchExchangeDetailsSaga);
}

export default exchangeDetailsSaga;
