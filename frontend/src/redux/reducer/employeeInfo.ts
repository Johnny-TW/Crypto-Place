import { EmployeeInfoState, BaseAction } from '../../types/redux';

const initialState: EmployeeInfoState = {
  data: {
    employeeInfo: {
      id: null,
      name: '',
      employeeId: '',
      department: '',
      email: '',
      year: '',
      createdAt: '',
      updatedAt: '',
    },
    employeesList: [],
  },
  loading: false,
  error: null,
};

const employeeInfoReducer = (
  state: EmployeeInfoState = initialState,
  action: BaseAction
): EmployeeInfoState => {
  switch (action.type) {
    case 'FETCH_EMPLOYEE_INFO_REQUEST':
    case 'FETCH_EMPLOYEES_LIST_REQUEST':
    case 'UPDATE_EMPLOYEE_INFO_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'FETCH_EMPLOYEE_INFO_SUCCESS':
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          employeeInfo: action.payload,
        },
        error: null,
      };

    case 'FETCH_EMPLOYEES_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          employeesList: action.payload,
        },
        error: null,
      };

    case 'UPDATE_EMPLOYEE_INFO_SUCCESS':
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          employeeInfo: action.payload,
        },
        error: null,
      };

    case 'FETCH_EMPLOYEE_INFO_FAILURE':
    case 'FETCH_EMPLOYEES_LIST_FAILURE':
    case 'UPDATE_EMPLOYEE_INFO_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default employeeInfoReducer;
