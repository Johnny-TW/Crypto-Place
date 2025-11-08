import { takeLatest, call, put, delay } from 'redux-saga/effects';
import axios from 'axios';
import { NFT_LIST } from '../api/api';
import { BaseAction } from '../../types/redux';

interface FetchNftListAction extends BaseAction {
  type: 'FETCH_NFT_LIST';
  payload: { order: string };
}

export const fetchNftList = (
  order: string = 'market_cap_usd_desc'
): FetchNftListAction => ({
  type: 'FETCH_NFT_LIST',
  payload: { order },
});

function* fetchNftListWithRetry(
  options: any,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Generator {
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response = yield call(axios.request, options);
      return response;
    } catch (error: any) {
      const isRateLimitError = error.response?.status === 429;

      if (isRateLimitError && attempt < maxRetries) {
        const retryAfter = error.response?.headers['retry-after'];
        const delayMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : baseDelay * 2 ** attempt;

        console.warn(
          `NFT API rate limit hit, retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries + 1})`
        );

        yield delay(delayMs);

        continue;
      }

      throw error;
    }
  }

  throw new Error('Maximum retry attempts exceeded');
}

function* fetchNftListSaga(action: FetchNftListAction): Generator {
  try {
    const { order } = action.payload;

    const options = {
      method: 'GET',
      url: NFT_LIST,
      params: {
        order,
      },
      headers: {
        accept: 'application/json',
      },
    };

    const response = yield call(fetchNftListWithRetry, options, 3, 1000);
    yield put({ type: 'FETCH_NFT_LIST_SUCCESS', payload: response.data });
  } catch (error: any) {
    const errorMessage =
      error.response?.status === 429
        ? 'API rate limit exceeded. Please try again later.'
        : error.message;
    yield put({ type: 'FETCH_NFT_LIST_FAILURE', error: errorMessage });
  }
}

function* nftDashboardSaga() {
  yield takeLatest('FETCH_NFT_LIST', fetchNftListSaga);
}

export default nftDashboardSaga;
