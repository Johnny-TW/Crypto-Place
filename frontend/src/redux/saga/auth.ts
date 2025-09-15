import { takeLatest, call, put } from 'redux-saga/effects';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { APIKit } from '../api/apiService';
import {
  LoginCredentials,
  RegisterData,
  EmployeeLoginData,
  APIResponse,
  AuthResponse,
  LoginAction,
  RegisterAction,
  EmployeeLoginAction,
} from '../../types/redux';

export const loginRequest = (credentials: LoginCredentials): LoginAction => ({
  type: 'LOGIN_REQUEST',
  payload: credentials,
});

export const registerRequest = (userData: RegisterData): RegisterAction => ({
  type: 'REGISTER_REQUEST',
  payload: userData,
});

export const employeeLoginRequest = (
  employeeData: EmployeeLoginData
): EmployeeLoginAction => ({
  type: 'EMPLOYEE_LOGIN_REQUEST',
  payload: employeeData,
});

export const logoutRequest = () => ({
  type: 'LOGOUT_REQUEST',
});

export const checkAuthStatus = () => ({
  type: 'CHECK_AUTH_STATUS',
});

function* loginSaga(action: LoginAction) {
  try {
    yield put({ type: 'SET_AUTH_LOADING', payload: true });

    const response: APIResponse<AuthResponse> = yield call(
      APIKit.post,
      '/api/auth/login',
      action.payload
    );

    const { access_token: accessToken, user } = response.data;

    Cookies.set('token', accessToken, { expires: 1 });

    yield put({
      type: 'LOGIN_SUCCESS',
      payload: { token: accessToken, user },
    });

    Swal.fire({
      icon: 'success',
      title: '登入成功！',
      text: `歡迎回來，${user.name}`,
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error: any) {
    yield put({
      type: 'LOGIN_FAILURE',
      payload: error.response?.data?.message || '登入失敗',
    });

    Swal.fire({
      icon: 'error',
      title: '登入失敗',
      text: error.response?.data?.message || '請檢查您的帳號密碼',
    });
  } finally {
    yield put({ type: 'SET_AUTH_LOADING', payload: false });
  }
}

function* employeeLoginSaga(action: EmployeeLoginAction) {
  try {
    yield put({ type: 'SET_AUTH_LOADING', payload: true });

    const response: APIResponse<AuthResponse> = yield call(
      APIKit.post,
      '/api/auth/employee-login',
      action.payload
    );

    const { access_token: accessToken, user, hrData } = response.data;

    Cookies.set('token', accessToken, { expires: 1 });

    yield put({
      type: 'EMPLOYEE_LOGIN_SUCCESS',
      payload: { token: accessToken, user, hrData },
    });

    Swal.fire({
      icon: 'success',
      title: '員工登入成功！',
      text: `歡迎，${user.name || user.enName || user.chName}`,
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error: any) {
    yield put({
      type: 'EMPLOYEE_LOGIN_FAILURE',
      payload: error.response?.data?.message || '員工登入失敗',
    });

    Swal.fire({
      icon: 'error',
      title: '員工登入失敗',
      text:
        error.response?.data?.message || '請檢查您的員工工號或聯繫系統管理員',
    });
  } finally {
    yield put({ type: 'SET_AUTH_LOADING', payload: false });
  }
}

function* registerSaga(action: RegisterAction) {
  try {
    yield put({ type: 'SET_AUTH_LOADING', payload: true });

    const response: APIResponse<AuthResponse> = yield call(
      APIKit.post,
      '/api/auth/register',
      action.payload
    );
    const { access_token: accessToken, user } = response.data;

    Cookies.set('token', accessToken, { expires: 1 });

    yield put({
      type: 'REGISTER_SUCCESS',
      payload: { token: accessToken, user },
    });

    Swal.fire({
      icon: 'success',
      title: '註冊成功！',
      text: `歡迎加入，${user.name}`,
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error: any) {
    yield put({
      type: 'REGISTER_FAILURE',
      payload: error.response?.data?.message || '註冊失敗',
    });

    Swal.fire({
      icon: 'error',
      title: '註冊失敗',
      text: error.response?.data?.message || '請檢查您的註冊資料',
    });
  } finally {
    yield put({ type: 'SET_AUTH_LOADING', payload: false });
  }
}

function* logoutSaga() {
  try {
    // 清除本地 token
    Cookies.remove('token');

    // 清除本地存儲
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 更新 Redux 狀態
    yield put({ type: 'LOGOUT_SUCCESS' });
    yield put({ type: 'CLEAR_EMPLOYEE_DATA' });

    // 顯示成功訊息並重定向
    Swal.fire({
      icon: 'success',
      title: '登出成功！',
      text: '您已成功登出',
      timer: 2000,
      showConfirmButton: false,
    });

    // 重定向到登入頁面
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  } catch (error: any) {
    console.error('Logout error:', error);
    Cookies.remove('token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    yield put({ type: 'LOGOUT_SUCCESS' });

    Swal.fire({
      icon: 'warning',
      title: '登出完成',
      text: '已清除本地登入狀態',
      timer: 2000,
      showConfirmButton: false,
    });

    // 重定向到登入頁面
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  }
}

function* checkAuthStatusSaga() {
  try {
    const token = Cookies.get('token');

    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response: APIResponse<any> = yield call(
        APIKit.get,
        '/api/auth/profile',
        config
      );

      yield put({
        type: 'AUTH_STATUS_SUCCESS',
        payload: { token, user: response.data },
      });
    } else {
      yield put({ type: 'AUTH_STATUS_NO_TOKEN' });
    }
  } catch (error: any) {
    Cookies.remove('token');
    yield put({
      type: 'AUTH_STATUS_FAILURE',
      payload: error.response?.data?.message || 'Token 無效',
    });
  }
}

function* authSaga() {
  yield takeLatest('LOGIN_REQUEST', loginSaga);
  yield takeLatest('EMPLOYEE_LOGIN_REQUEST', employeeLoginSaga);
  yield takeLatest('REGISTER_REQUEST', registerSaga);
  yield takeLatest('LOGOUT_REQUEST', logoutSaga);
  yield takeLatest('CHECK_AUTH_STATUS', checkAuthStatusSaga);
}

export default authSaga;
