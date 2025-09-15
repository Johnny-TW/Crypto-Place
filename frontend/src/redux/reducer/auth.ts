import { AuthState, AuthAction } from '../../types/redux';

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  error: null,
  hrData: null,
  loginType: null,
};

const authReducer = (
  state: AuthState = initialState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case 'SET_AUTH_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        error: null,
      };

    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        loginType: 'user',
        hrData: null,
      };

    case 'EMPLOYEE_LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        loginType: 'employee',
        hrData: action.payload.hrData,
      };

    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
    case 'EMPLOYEE_LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        error: action.payload,
        loginType: null,
        hrData: null,
      };

    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        error: null,
        loginType: null,
        hrData: null,
      };

    case 'LOGOUT_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'AUTH_STATUS_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        loginType: action.payload.user?.loginType || 'user',
        hrData:
          action.payload.user?.loginType === 'employee'
            ? action.payload.user.hrData
            : null,
      };

    case 'AUTH_STATUS_NO_TOKEN':
    case 'AUTH_STATUS_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        error: action.payload || null,
      };

    case 'CLEAR_AUTH_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default authReducer;
