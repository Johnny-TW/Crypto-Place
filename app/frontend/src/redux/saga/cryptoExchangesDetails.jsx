import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';

function* fetchExchangeDetailsSaga(action) {
  try {
    const options = {
      method: 'GET',
      url: `http://localhost:5001/api/exchanges/${action.payload}`,
      headers: {
        accept: 'application/json',
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
