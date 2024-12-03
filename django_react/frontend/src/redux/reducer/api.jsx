import _ from "lodash";

const initialState = {
  loading: 0,
  loadingStack: [],
  errorMessage: null,
  successMessage: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOADING":
      const { loading, path } = action.data
      let loadingStack = state.loadingStack

      if (loading && _.find(loadingStack, { path, loading }))
        return state;

      //只要path開頭一樣就刪除，避免takeLatest issue
      loadingStack =
        loading ?
          [...loadingStack, { path, loading }] :
          _.filter(loadingStack, (item) => _.first(_.split(item.path, "/")) !== _.first(_.split(path, "/")))

      return {
        ...state,
        loadingStack: loadingStack,
        loading: loadingStack.length,
      };
    case "SET_ERROR_MESSAGE":
      return {
        ...state,
        errorMessage: action.data
      };
    case "CLEAR_ERROR_MESSAGE":
      return {
        ...state,
        errorMessage: null,
      };
    case "SET_SUCCESS_MESSAGE":
      return {
        ...state,
        successMessage: action.data,
      };
    case "CLEAR_SUCCESS_MESSAGE":
      return {
        ...state,
        successMessage: null,
      };
    default:
      return state
  }
}

export default reducer