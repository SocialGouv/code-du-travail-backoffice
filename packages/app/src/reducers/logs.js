import { actionTypes } from "../actions/index";

export const initialState = {
  checked: [],
  error: null,
  isLoading: true,
  list: [],
  pageIndex: 0,
  pagesLength: 0,
  query: "",
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    /* MULTIPLE LOGS ―――――――――――――――――――― */

    case actionTypes.LOGS_DELETE_OLDER_THAN_ONE_WEEK:
    case actionTypes.LOGS_LOAD:
      return {
        ...state,
        isLoading: true,
      };

    case actionTypes.LOGS_DELETE_OLDER_THAN_ONE_WEEK_FAILURE:
    case actionTypes.LOGS_LOAD_FAILURE:
      return {
        ...state,
        error: payload.message,
        isLoading: false,
      };

    case actionTypes.LOGS_LOAD_SUCCESS:
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
