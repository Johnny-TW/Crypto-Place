import { takeLatest, call, put, delay } from 'redux-saga/effects';
import { call as apiCall, API_METHOD } from '../api/apiService';
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
  path: string,
  params: any,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Generator {
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response: any = yield call(apiCall, {
        method: API_METHOD.GET,
        path,
        params,
      });
      return response;
    } catch (error: any) {
      // Ignore cancelled requests
      if (error.message === 'Cancel') {
        throw error;
      }

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

    const response: any = yield call(
      fetchNftListWithRetry,
      NFT_LIST,
      {
        params: { order },
        headers: { accept: 'application/json' },
      },
      3,
      1000
    );
    yield put({ type: 'FETCH_NFT_LIST_SUCCESS', payload: response.data });
  } catch (error: any) {
    // Ignore cancelled requests
    if (error.message === 'Cancel') {
      return;
    }

    // 處理不同的錯誤狀態碼
    const status = error.response?.status;

    let errorMessage = error.message;

    if (status === 500) {
      errorMessage = `伺服器錯誤 (500): ${error.message}`;
    } else if (status === 429) {
      errorMessage = 'API rate limit exceeded. Please try again later.';
    }

    yield put({ type: 'FETCH_NFT_LIST_FAILURE', error: errorMessage });
  }
}

function* nftDashboardSaga() {
  yield takeLatest('FETCH_NFT_LIST', fetchNftListSaga);
}

export default nftDashboardSaga;
