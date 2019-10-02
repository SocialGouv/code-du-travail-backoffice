import { actionTypes } from "../actions/index";
import { ANSWER_STATE } from "../constants";

const initialState = {
  checked: [],
  data: [],
  error: null,
  isLoading: true,
  pageLength: 0,
  pageIndex: 0,
  query: "",
  state: ANSWER_STATE.PENDING_REVIEW
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    /* ONE ANSWER ―――――――――――――――――――――― */
    case actionTypes.ANSWER_LOAD_ONE:
      return {
        ...state,
        isLoading: true
      };

    case actionTypes.ANSWER_LOAD_ONE_FAILURE:
      return {
        ...state,
        error: payload.message,
        isLoading: false
      };

    case actionTypes.ANSWER_LOAD_ONE_SUCCESS:
      return {
        ...state,
        data: payload.data,
        isLoading: false
      };

    /* MULTIPLE ANSWERS ―――――――――――――――― */

    case actionTypes.ANSWERS_CANCEL:
    case actionTypes.ANSWERS_LOAD:
    case actionTypes.ANSWER_UPDATE_GENERIC_REFERENCE:
    case actionTypes.ANSWER_UPDATE_IS_PUBLISHED:
    case actionTypes.ANSWER_UPDATE_STATE:
      return {
        ...state,
        isLoading: true
      };

    case actionTypes.ANSWERS_CANCEL_FAILURE:
    case actionTypes.ANSWERS_LOAD_FAILURE:
    case actionTypes.ANSWER_UPDATE_GENERIC_REFERENCE_FAILURE:
    case actionTypes.ANSWER_UPDATE_IS_PUBLISHED_REFERENCE_FAILURE:
    case actionTypes.ANSWER_UPDATE_STATE_FAILURE:
    case actionTypes.ANSWERS_TOGGLE_CHECK_FAILURE:
      return {
        ...state,
        error: payload.message,
        isLoading: false
      };

    case actionTypes.ANSWERS_LOAD_SUCCESS:
      return {
        ...state,
        checked: [],
        data: payload.data,
        error: null,
        pageLength: payload.pageLength,
        pageIndex: payload.pageIndex,
        query: payload.query,
        isLoading: false,
        state: payload.state
      };

    case actionTypes.ANSWERS_TOGGLE_CHECK_SUCESS:
      return {
        ...state,
        checked: payload.checked
      };

    default:
      return state;
  }
};
