import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { CRYPTO_NEWS } from '../api/api';

// 定義 fetchCryptoNews 動作創建器
export const fetchCryptoNews = (excludeCategory) => ({
  type: 'FETCH_CRYPTO_NEWS',
  payload: excludeCategory,
});

// 定義 fetchCryptoNews saga
export function* fetchCryptoNewsSaga(action) {
  try {
    const excludeCategory = action.payload;

    const options = {
      method: 'GET',
      url: CRYPTO_NEWS,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      params: {
        lang: 'EN',
        limit: 10,
        exclude_categories: excludeCategory,
        api_key: 'b1b0f1cbc762734d6003ea2af861dadecdd20ed39e717d8b4a15bf351640488b',
      },
    };

    console.log('API Request params:', options.params);

    const response = yield call(axios.request, options);
    console.log('API Response:', response.data);

    yield put({ type: 'FETCH_CRYPTO_NEWS_SUCCESS', payload: response.data.Data });
  } catch (error) {
    yield put({ type: 'FETCH_CRYPTO_NEWS_FAILURE', error: error.message });
  }
}

// 定義根 saga
function* mySaga() {
  yield takeLatest('FETCH_CRYPTO_NEWS', fetchCryptoNewsSaga);
}

export default mySaga;
