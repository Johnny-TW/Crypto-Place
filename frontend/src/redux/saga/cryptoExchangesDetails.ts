import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { API_METHOD } from '../api/apiService';
import { BaseAction } from '../../types/redux';
import { getApiBaseUrl } from '../../utils/apiConfig';

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
    const options = {
      method: API_METHOD.GET,
      url: `${getApiBaseUrl()}/api/exchanges/${action.payload}`,
      headers: {
        accept: 'application/json',
      },
    };

    const response = yield call(axios.request, options);
    yield put({
      type: 'FETCH_EXCHANGE_DETAILS_SUCCESS',
      payload: response.data,
    });
  } catch (error: any) {
    yield put({
      type: 'FETCH_EXCHANGE_DETAILS_FAILURE',
      payload: error.message,
    });
  }
}

function* exchangeDetailsSaga() {
  yield takeLatest('FETCH_EXCHANGE_DETAILS', fetchExchangeDetailsSaga);
}

export default exchangeDetailsSaga;
