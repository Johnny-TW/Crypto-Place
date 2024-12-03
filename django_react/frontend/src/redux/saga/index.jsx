import { all, put } from 'redux-saga/effects';
import Cookies from 'js-cookie'
import Swal from 'sweetalert2';
// Sage API
import CoinList from './cryptoDashboard'
import { API_METHOD, APIKit } from '../api/apiService';

export function* setLoading(loading, path, method) {
  yield put({ type: 'SET_LOADING', data: { loading, path, method } })
}

export function* fetchApi({
  method,
  path,
  reducer = null,
  data = null,
  successMessage = null,
  successAction,
  errorAction,
  failValue = null,
  params = {},
  json = false,
  parameters = null,
}) {

  try {
    const response = yield APIKit.request({
      method,
      url,
      params,
      headers,
    });

    yield put({ type: reducer, data: response.data });

    if (reducer) {
      yield put({ type: reducer, data: response.data });
    }
    if (successMessage) {
      Swal.fire('Success', successMessage, 'success');
    }

    result = response.data;

  } catch (error) {
    Swal.fire('Error', error.message, 'error');
  }

  console.log(result);
  return result;
};

function* rootSaga() {
  yield all([
    CoinList(),
  ]);
}

export default rootSaga;
