import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { COIN_LIST } from '../api/api';

function* fetchCoinListSaga(action) {
  try {
    const options = {
      headers: {
        accept: 'application/json',
      },
    };

    const response = yield call(
      axios.get,
      `${COIN_LIST}?vs_currency=${action.payload.currency}`,
      options
    );
    yield put({ type: 'FETCH_COIN_LIST_SUCCESS', payload: response.data });
  } catch (error) {
    yield put({ type: 'FETCH_COIN_LIST_FAILURE', error: error.message });
  }
}

function* mySaga() {
  yield takeLatest('FETCH_COIN_LIST', fetchCoinListSaga);
}

export default mySaga;
