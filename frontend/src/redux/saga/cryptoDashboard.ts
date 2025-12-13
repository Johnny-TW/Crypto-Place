import { takeLatest, call, put } from 'redux-saga/effects';
import { call as apiCall, API_METHOD } from '../api/apiService';
import { BaseAction } from '../../types/redux';

interface FetchCoinListAction extends BaseAction {
  type: 'FETCH_COIN_LIST';
  payload: {
    currency: string;
  };
}

function* fetchCoinListSaga(action: FetchCoinListAction): Generator {
  try {
    // Use apiCall with cancellation support
    const response: any = yield call(apiCall, {
      method: API_METHOD.GET,
      path: '/coins/markets',
      params: {
        params: {
          vs_currency: action.payload.currency,
        },
        headers: {
          accept: 'application/json',
        },
      },
    });

    yield put({ type: 'FETCH_COIN_LIST_SUCCESS', payload: response.data });
  } catch (error: any) {
    // Ignore cancelled requests
    if (error.message === 'Cancel') {
      return;
    }

    yield put({ type: 'FETCH_COIN_LIST_FAILURE', error: error.message });
  }
}

function* mySaga() {
  // takeLatest will automatically cancel previous pending requests
  yield takeLatest('FETCH_COIN_LIST', fetchCoinListSaga);
}

export default mySaga;
