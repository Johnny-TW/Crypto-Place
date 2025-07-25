import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import Cookies from 'js-cookie';
import { EMPLOYEE_INFO, EMPLOYEES_LIST } from '../api/api';

export const fetchEmployeeInfo = () => ({
  type: 'FETCH_EMPLOYEE_INFO_REQUEST',
});

export const fetchEmployeesList = () => ({
  type: 'FETCH_EMPLOYEES_LIST_REQUEST',
});

export const updateEmployeeInfo = employeeData => ({
  type: 'UPDATE_EMPLOYEE_INFO_REQUEST',
  payload: employeeData,
});

function* fetchEmployeeInfoSaga() {
  try {
    const token = Cookies.get('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = yield call(axios.get, EMPLOYEE_INFO, config);
    yield put({
      type: 'FETCH_EMPLOYEE_INFO_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: 'FETCH_EMPLOYEE_INFO_FAILURE',
      payload: error.message,
    });
  }
}

function* fetchEmployeesListSaga() {
  try {
    const token = Cookies.get('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = yield call(axios.get, EMPLOYEES_LIST, config);
    yield put({
      type: 'FETCH_EMPLOYEES_LIST_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: 'FETCH_EMPLOYEES_LIST_FAILURE',
      payload: error.message,
    });
  }
}

function* updateEmployeeInfoSaga(action) {
  try {
    const token = Cookies.get('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = yield call(
      axios.put,
      EMPLOYEE_INFO,
      action.payload,
      config
    );
    yield put({
      type: 'UPDATE_EMPLOYEE_INFO_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
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
