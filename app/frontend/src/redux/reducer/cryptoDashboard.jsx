const initialState = {
  coinList: [],
  loading: false,
  error: null,
};

const coinListReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_COIN_LIST':
      return { ...state, loading: true, error: null };
    case 'FETCH_COIN_LIST_SUCCESS':
      return { ...state, loading: false, coinList: action.payload };
    case 'FETCH_COIN_LIST_FAILURE':
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default coinListReducer;
