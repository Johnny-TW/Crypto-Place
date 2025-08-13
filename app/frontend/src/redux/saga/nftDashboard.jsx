import { takeLatest, call, put, delay } from 'redux-saga/effects';
import axios from 'axios';
import { NFT_LIST } from '../api/api';

export const fetchNftList = (order = 'market_cap_usd_desc') => ({
  type: 'FETCH_NFT_LIST',
  payload: { order },
});

function* fetchNftListWithRetry(options, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response = yield call(axios.request, options);
      return response;
    } catch (error) {
      const isRateLimitError = error.response?.status === 429;

      if (isRateLimitError && attempt < maxRetries) {
        const retryAfter = error.response?.headers['retry-after'];
        const delayMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : baseDelay * 2 ** attempt;

        // eslint-disable-next-line no-console
        console.warn(
          `NFT API rate limit hit, retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries + 1})`
        );

        yield delay(delayMs);
        // eslint-disable-next-line no-continue
        continue;
      }

      throw error;
    }
  }

  throw new Error('Maximum retry attempts exceeded');
}

function* fetchNftListSaga(action) {
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
  } catch (error) {
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
