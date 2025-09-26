import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { SIMPLE_PRICE } from '../api/api';
import { SimplePriceParams } from '../reducer/simplePrice';

interface FetchSimplePriceAction {
  type: 'FETCH_SIMPLE_PRICE';
  payload: SimplePriceParams;
}

function* fetchSimplePriceSaga(action: FetchSimplePriceAction): Generator {
  try {
    const {
      ids,
      vsCurrencies,
      include24hrChange,
      include24hrVol,
      includeMarketCap,
    } = action.payload;

    const queryParams = new URLSearchParams({
      ids: ids.join(','),
      vs_currencies: vsCurrencies,
      include_24hr_change: include24hrChange.toString(),
      include_24hr_vol: include24hrVol.toString(),
      include_market_cap: includeMarketCap.toString(),
    });

    const options = {
      headers: {
        accept: 'application/json',
      },
    };

    const response: any = yield call(
      axios.get,
      `${SIMPLE_PRICE}?${queryParams}`,
      options
    );

    yield put({
      type: 'FETCH_SIMPLE_PRICE_SUCCESS',
      payload: response.data,
    });
  } catch (error: any) {
    yield put({
      type: 'FETCH_SIMPLE_PRICE_FAILURE',
      error: error.message || '獲取價格數據失敗',
    });
  }
}

function* simplePriceSaga() {
  yield takeLatest('FETCH_SIMPLE_PRICE', fetchSimplePriceSaga);
}

export default simplePriceSaga;
