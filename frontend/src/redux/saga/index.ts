import { all, put, call } from 'redux-saga/effects';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { APIKit } from '../api/apiService';
import CoinList from './cryptoDashboard';
import CryptoNews from './cryptoNews';
import CryptoDetails from './cryptoDetails';
import CryptoCoinChart from './cryptoCoinChart';
import CryptoMarketList from './cryptoMarketList';
import exchangeDetailsSaga from './cryptoExchangesDetails';
import nftDashboardSaga from './nftDashboard';
import nftDetailsSaga from './nftDetails';
import employeeInfoSaga from './employeeInfo';
import authSaga from './auth';
import { watchlistSaga } from './watchlist';

export function* setLoading(
  loading: boolean,
  path: string,
  method: string
): Generator {
  yield put({ type: 'SET_LOADING', data: { loading, path, method } });
}

interface FetchApiParams {
  method: string;
  path: string;
  reducer?: string | null;
  data?: any;
  successMessage?: string | null;
  successAction?: (_data: any) => any;
  errorAction?: (_error: any) => any;
  failValue?: any;
  params?: object;
  json?: boolean;
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
}: FetchApiParams): Generator {
  try {
    const response = yield call(APIKit.request, {
      method,
      url: path,
      params,
      headers: {
        'Content-Type': json
          ? 'application/json'
          : 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      data,
    });

    if (reducer) {
      yield put({ type: reducer, data: response.data });
    }
    if (successMessage) {
      Swal.fire('Success', successMessage, 'success');
    }

    if (successAction) {
      yield put(successAction(response.data));
    }

    return response.data;
  } catch (error: any) {
    if (errorAction) {
      yield put(errorAction(error));
    }
    Swal.fire('Error', error.message, 'error');
    return failValue;
  }
}

function* rootSaga() {
  yield all([
    CoinList(),
    CryptoNews(),
    CryptoDetails(),
    CryptoCoinChart(),
    CryptoMarketList(),
    exchangeDetailsSaga(),
    nftDashboardSaga(),
    nftDetailsSaga(),
    employeeInfoSaga(),
    authSaga(),
    watchlistSaga(),
  ]);
}

export default rootSaga;
