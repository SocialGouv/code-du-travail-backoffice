import { actionTypes } from "../actions/index";

const initialState = {
  checked: [],
  data: [],
  error: null,
  isLoading: true,
  pagesLength: 0,
  pageIndex: 0,
  query: ""
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    /* MULTIPLE AGREEMENTS ―――――――――――――― */

    case actionTypes.AGREEMENTS_LOAD:
      return {
        ...state,
        isLoading: true
      };

    case actionTypes.AGREEMENTS_LOAD_FAILURE:
      return {
        ...state,
        error: payload.message,
        isLoading: false
      };

    case actionTypes.AGREEMENTS_LOAD_SUCCESS:
      return {
        ...state,
        checked: [],
        data: payload.data,
        error: null,
        pagesLength: payload.pagesLength,
        pageIndex: payload.pageIndex,
        query: payload.query,
        isLoading: false
      };

    default:
      return state;
  }
};
