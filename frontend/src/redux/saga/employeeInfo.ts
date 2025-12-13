import { takeLatest, call, put } from 'redux-saga/effects';
import { call as apiCall, API_METHOD } from '../api/apiService';
import Cookies from 'js-cookie';
import { EMPLOYEE_INFO, EMPLOYEES_LIST } from '../api/api';
import { BaseAction } from '../../types/redux';

interface FetchEmployeeInfoAction extends BaseAction {
  type: 'FETCH_EMPLOYEE_INFO_REQUEST';
}

interface FetchEmployeesListAction extends BaseAction {
  type: 'FETCH_EMPLOYEES_LIST_REQUEST';
}

interface UpdateEmployeeInfoAction extends BaseAction {
  type: 'UPDATE_EMPLOYEE_INFO_REQUEST';
  payload: any;
}

export const fetchEmployeeInfo = (): FetchEmployeeInfoAction => ({
  type: 'FETCH_EMPLOYEE_INFO_REQUEST',
});

export const fetchEmployeesList = (): FetchEmployeesListAction => ({
  type: 'FETCH_EMPLOYEES_LIST_REQUEST',
});

export const updateEmployeeInfo = (
  employeeData: any
): UpdateEmployeeInfoAction => ({
  type: 'UPDATE_EMPLOYEE_INFO_REQUEST',
  payload: employeeData,
});

function* fetchEmployeeInfoSaga(): Generator {
  try {
    const token = Cookies.get('token');
    const response: any = yield call(apiCall, {
      method: API_METHOD.GET,
      path: EMPLOYEE_INFO,
      params: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    yield put({
      type: 'FETCH_EMPLOYEE_INFO_SUCCESS',
      payload: response.data,
    });
  } catch (error: any) {
    // Ignore cancelled requests
    if (error.message === 'Cancel') {
      return;
    }
    yield put({
      type: 'FETCH_EMPLOYEE_INFO_FAILURE',
      payload: error.message,
    });
  }
}

function* fetchEmployeesListSaga(): Generator {
  try {
    const token = Cookies.get('token');
    const response: any = yield call(apiCall, {
      method: API_METHOD.GET,
      path: EMPLOYEES_LIST,
      params: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    yield put({
      type: 'FETCH_EMPLOYEES_LIST_SUCCESS',
      payload: response.data,
    });
  } catch (error: any) {
    // Ignore cancelled requests
    if (error.message === 'Cancel') {
      return;
    }
    yield put({
      type: 'FETCH_EMPLOYEES_LIST_FAILURE',
      payload: error.message,
    });
  }
}

function* updateEmployeeInfoSaga(action: UpdateEmployeeInfoAction): Generator {
  try {
    const token = Cookies.get('token');
    const response: any = yield call(apiCall, {
      method: API_METHOD.PUT,
      path: EMPLOYEE_INFO,
      data: action.payload,
      params: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    yield put({
      type: 'UPDATE_EMPLOYEE_INFO_SUCCESS',
      payload: response.data,
    });
  } catch (error: any) {
    // Ignore cancelled requests
    if (error.message === 'Cancel') {
      return;
    }
    yield put({
      type: 'UPDATE_EMPLOYEE_INFO_FAILURE',
      payload: error.message,
    });
  }
}

function* employeeInfoSaga() {
  yield takeLatest('FETCH_EMPLOYEE_INFO_REQUEST', fetchEmployeeInfoSaga);
  yield takeLatest('FETCH_EMPLOYEES_LIST_REQUEST', fetchEmployeesListSaga);
  yield takeLatest('UPDATE_EMPLOYEE_INFO_REQUEST', updateEmployeeInfoSaga);
}

export default employeeInfoSaga;
