import { actionTypes } from "../actions/index";

export const initialState = {
  checked: [],
  data: null,
  error: null,
  isLoading: true,
  list: [],
  pageIndex: 0,
  pagesLength: 0,
  query: "",
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    /* MULTIPLE AGREEMENTS ―――――――――――――― */

    case actionTypes.AGREEMENTS_LOAD:
      return {
        ...state,
        isLoading: true,
      };

    case actionTypes.AGREEMENTS_LOAD_FAILURE:
      return {
        ...state,
        error: payload.message,
        isLoading: false,
      };

    case actionTypes.AGREEMENTS_LOAD_SUCCESS:
      return {
        ...state,
        checked: [],
        error: null,
        isLoading: false,
        list: payload.list,
        pageIndex: payload.pageIndex,
        pagesLength: payload.pagesLength,
        query: payload.query,
      };

    default:
      return state;
  }
};
