import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { CRYPTO_NEWS } from '../api/api';
import { BaseAction } from '../../types/redux';

interface FetchCryptoNewsAction extends BaseAction {
  type: 'FETCH_CRYPTO_NEWS';
  payload: string;
}

export const fetchCryptoNews = (
  excludeCategory: string
): FetchCryptoNewsAction => ({
  type: 'FETCH_CRYPTO_NEWS',
  payload: excludeCategory,
});

export function* fetchCryptoNewsSaga(action: FetchCryptoNewsAction): Generator {
  try {
    yield put({ type: 'FETCH_CRYPTO_NEWS_REQUEST' });

    const excludeCategory = action.payload;

    // 使用後端 API 而不是直接調用外部 API
    const params = {
      lang: 'EN',
      limit: 10,
      exclude_categories: excludeCategory,
    };

    // eslint-disable-next-line no-console
    console.log('API Request params:', params);

    const response = yield call(axios.get, CRYPTO_NEWS, { params });
    // eslint-disable-next-line no-console
    console.log('API Response:', response.data);

    // 如果返回的數據是嵌套的，提取正確的數據
    const newsData = response.data.Data || response.data;

    yield put({
      type: 'FETCH_CRYPTO_NEWS_SUCCESS',
      payload: newsData,
    });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('News API Error:', error);
    yield put({ type: 'FETCH_CRYPTO_NEWS_FAILURE', error: error.message });
  }
}

function* mySaga() {
  yield takeLatest('FETCH_CRYPTO_NEWS', fetchCryptoNewsSaga);
}

export default mySaga;
