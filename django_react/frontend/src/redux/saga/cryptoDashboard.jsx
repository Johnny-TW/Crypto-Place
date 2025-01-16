// 假設這是你的 saga 文件
import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { COIN_LIST } from '../api/api';

// 定義 fetchCoinList 動作創建器
export const fetchCoinList = (currency) => ({
  type: 'FETCH_COIN_LIST',
  payload: { currency },
});

// 定義 fetchCoinList saga
function* fetchCoinListSaga(action) {
  try {
    const options = {
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-nrJXAB28gG2xbfsdLieGcxWB',
      },
    };

    const response = yield call(axios.get, `${COIN_LIST}?vs_currency=${action.payload.currency}`, options);
    yield put({ type: 'FETCH_COIN_LIST_SUCCESS', payload: response.data });
  } catch (error) {
    yield put({ type: 'FETCH_COIN_LIST_FAILURE', error: error.message });
  }
}

// 定義根 saga
function* mySaga() {
  yield takeLatest('FETCH_COIN_LIST', fetchCoinListSaga);
}

export default mySaga;
