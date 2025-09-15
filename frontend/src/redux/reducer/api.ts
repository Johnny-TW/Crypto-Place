import _ from 'lodash';
import { BaseAction } from '../../types/redux';

interface APIState {
  loading: number;
  loadingStack: any[];
  error: any;
  success: any;
  deleted: any;
}

const initialState: APIState = {
  loading: 0,
  loadingStack: [],
  error: null,
  success: null,
  deleted: null,
};

const reducer = (
  state: APIState = initialState,
  action: BaseAction
): APIState => {
  switch (action.type) {
    case 'SET_LOADING': {
      const { loading, path } = action.data;
      let { loadingStack } = state;

      if (loading && _.find(loadingStack, { path, loading })) return state;

      // 只要path開頭一樣就刪除，避免takeLatest issue
      loadingStack = loading
        ? [...loadingStack, action.data]
        : _.filter(
            loadingStack,
            item =>
              _.first(_.split(item.path, '/')) !== _.first(_.split(path, '/'))
          );

      return {
        ...state,
        loadingStack,
        loading: loadingStack.length,
      };
    }
    case 'SET_API_ERROR':
      return {
        ...state,
        error: action.data,
      };
    case 'CLEAR_API_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_API_SUCCESS':
      return {
        ...state,
        success: action.data,
      };
    case 'CLEAR_API_SUCCESS':
      return {
        ...state,
        success: null,
      };
    case 'SET_API_DELETE':
      return {
        ...state,
        deleted: action.data,
      };
    case 'CLEAR_API_DELETE':
      return {
        ...state,
        deleted: null,
      };
    default:
      return state;
  }
};

export default reducer;
