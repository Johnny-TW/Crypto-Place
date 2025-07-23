import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const loginRequest = credentials => ({
  type: 'LOGIN_REQUEST',
  payload: credentials,
});

export const registerRequest = userData => ({
  type: 'REGISTER_REQUEST',
  payload: userData,
});

export const logoutRequest = () => ({
  type: 'LOGOUT_REQUEST',
});

export const checkAuthStatus = () => ({
  type: 'CHECK_AUTH_STATUS',
});

function* loginSaga(action) {
  try {
    yield put({ type: 'SET_AUTH_LOADING', payload: true });

    const response = yield call(
      axios.post,
      `${API_BASE_URL}/api/auth/login`,
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

    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  } catch (error) {
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

function* registerSaga(action) {
  try {
    yield put({ type: 'SET_AUTH_LOADING', payload: true });

    const response = yield call(
      axios.post,
      `${API_BASE_URL}/api/auth/register`,
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
  } catch (error) {
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
    Cookies.remove('token');

    yield put({ type: 'LOGOUT_SUCCESS' });

    yield put({ type: 'CLEAR_EMPLOYEE_DATA' });

    Swal.fire({
      icon: 'success',
      title: '登出成功！',
      text: '您已成功登出',
      timer: 2000,
      showConfirmButton: false,
    });

    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  } catch (error) {
    yield put({
      type: 'LOGOUT_FAILURE',
      payload: error.message,
    });
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

      const response = yield call(
        axios.get,
        `${API_BASE_URL}/api/auth/profile`,
        config
      );

      yield put({
        type: 'AUTH_STATUS_SUCCESS',
        payload: { token, user: response.data },
      });
    } else {
      yield put({ type: 'AUTH_STATUS_NO_TOKEN' });
    }
  } catch (error) {
    Cookies.remove('token');
    yield put({
      type: 'AUTH_STATUS_FAILURE',
      payload: error.response?.data?.message || 'Token 無效',
    });
  }
}

function* authSaga() {
  yield takeLatest('LOGIN_REQUEST', loginSaga);
  yield takeLatest('REGISTER_REQUEST', registerSaga);
  yield takeLatest('LOGOUT_REQUEST', logoutSaga);
  yield takeLatest('CHECK_AUTH_STATUS', checkAuthStatusSaga);
}

export default authSaga;
