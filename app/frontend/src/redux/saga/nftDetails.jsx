import { takeLatest, call, put, delay } from 'redux-saga/effects';
import axios from 'axios';
import { NFT_DETAILS, CRYPTO_NEWS } from '../api/api';

export const fetchNftDetails = nftId => ({
  type: 'FETCH_NFT_DETAILS',
  payload: { nftId },
});

export const fetchNftNews = () => ({
  type: 'FETCH_NFT_NEWS',
});

function* fetchNftDetailsWithRetry(options, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response = yield call(axios.request, options);
      return response;
    } catch (error) {
      const isRateLimitError = error.response?.status === 429;

      if (isRateLimitError && attempt < maxRetries) {
        const retryAfter = error.response?.headers['retry-after'];
        const delayMs = retryAfter
          ? parseInt(retryAfter, 10) // 添加 radix 參數
          : baseDelay * 2 ** attempt;

        // eslint-disable-next-line no-console
        console.warn(
          `NFT Details API rate limit hit, retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries + 1})`
        );

        yield delay(delayMs);

        // eslint-disable-next-line no-continue
        continue;
      }

      if (attempt === maxRetries) {
        throw error;
      }
    }
  }

  throw new Error('Maximum retry attempts exceeded');
}

function* fetchNftDetailsSaga(action) {
  try {
    const { nftId } = action.payload;

    const options = {
      method: 'GET',
      url: `${NFT_DETAILS}/${nftId}`,
      headers: {
        accept: 'application/json',
      },
    };

    const response = yield call(fetchNftDetailsWithRetry, options, 3, 1000);
    yield put({ type: 'FETCH_NFT_DETAILS_SUCCESS', payload: response.data });
  } catch (error) {
    const errorMessage =
      error.response?.status === 429
        ? 'API rate limit exceeded. Please try again later.'
        : 'Failed to fetch NFT data';
    yield put({ type: 'FETCH_NFT_DETAILS_FAILURE', error: errorMessage });
  }
}

function* fetchNftNewsSaga() {
  try {
    const params = new URLSearchParams({
      lang: 'EN',
      limit: '4',
      exclude_categories: 'ETH',
    });

    const options = {
      method: 'GET',
      url: `${CRYPTO_NEWS}?${params}`,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    };

    const response = yield call(axios.request, options);
    yield put({ type: 'FETCH_NFT_NEWS_SUCCESS', payload: response.data.Data });
  } catch (error) {
    const errorMessage = 'Failed to fetch NFT news';
    yield put({ type: 'FETCH_NFT_NEWS_FAILURE', error: errorMessage });
  }
}

function* nftDetailsSaga() {
  yield takeLatest('FETCH_NFT_DETAILS', fetchNftDetailsSaga);
  yield takeLatest('FETCH_NFT_NEWS', fetchNftNewsSaga);
}

export default nftDetailsSaga;
