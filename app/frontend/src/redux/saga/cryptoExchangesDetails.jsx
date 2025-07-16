import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { API_METHOD } from '../api/apiService.jsx';

export const fetchExchangeDetails = exchangeId => ({
  type: 'FETCH_EXCHANGE_DETAILS',
  payload: exchangeId,
});

function* fetchExchangeDetailsSaga(action) {
  try {
    const options = {
      method: API_METHOD.GET,
      url: `http://localhost:5001/api/exchanges/${action.payload}`,
      headers: {
        accept: 'application/json',
      },
    };

    const response = yield call(axios.request, options);
    yield put({
      type: 'FETCH_EXCHANGE_DETAILS_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: 'FETCH_EXCHANGE_DETAILS_FAILURE',
      payload: error.message,
    });
  }
}

function* exchangeDetailsSaga() {
  yield takeLatest('FETCH_EXCHANGE_DETAILS', fetchExchangeDetailsSaga);
}

export default exchangeDetailsSaga;
