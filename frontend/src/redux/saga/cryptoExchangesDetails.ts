import { takeLatest, call, put } from 'redux-saga/effects';
import { call as apiCall, API_METHOD } from '../api/apiService';
import { BaseAction } from '../../types/redux';

interface FetchExchangeDetailsAction extends BaseAction {
  type: 'FETCH_EXCHANGE_DETAILS';
  payload: string;
}

export const fetchExchangeDetails = (
  exchangeId: string
): FetchExchangeDetailsAction => ({
  type: 'FETCH_EXCHANGE_DETAILS',
  payload: exchangeId,
});

function* fetchExchangeDetailsSaga(
  action: FetchExchangeDetailsAction
): Generator {
  try {
    // Use apiCall with cancellation support
    const response: any = yield call(apiCall, {
      method: API_METHOD.GET,
      path: `/exchanges/${action.payload}`,
      params: {
        headers: {
          accept: 'application/json',
        },
      },
    });

    yield put({
      type: 'FETCH_EXCHANGE_DETAILS_SUCCESS',
      payload: response.data,
    });
  } catch (error: any) {
    // Ignore cancelled requests
    if (error.message === 'Cancel') {
      return;
    }

    yield put({
      type: 'FETCH_EXCHANGE_DETAILS_FAILURE',
      payload: error.message,
    });
  }
}

function* exchangeDetailsSaga() {
  // takeLatest will automatically cancel previous pending requests
  yield takeLatest('FETCH_EXCHANGE_DETAILS', fetchExchangeDetailsSaga);
}

export default exchangeDetailsSaga;
