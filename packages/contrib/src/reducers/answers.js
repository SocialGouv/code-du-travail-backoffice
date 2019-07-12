import { actionTypes } from "../actions/index";
import { ANSWER_STATE } from "../constants";

const initialState = {
  data: [],
  error: null,
  pageLength: 0,
  pageIndex: 0,
  isLoading: true,
  state: ANSWER_STATE.PENDING_REVIEW
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case actionTypes.ANSWERS_CANCEL:
    case actionTypes.ANSWERS_LOAD:
    case actionTypes.ANSWERS_SET_GENERIC_REFERENCE:
    case actionTypes.ANSWERS_SET_STATE:
      return {
        ...state,
        isLoading: true
      };

    case actionTypes.ANSWERS_CANCEL_FAILURE:
    case actionTypes.ANSWERS_LOAD_FAILURE:
    case actionTypes.ANSWERS_SET_GENERIC_REFERENCE_FAILURE:
    case actionTypes.ANSWERS_SET_STATE_FAILURE:
      return {
        ...state,
        error: payload.message,
        isLoading: false
      };

    case actionTypes.ANSWERS_LOAD_SUCCESS:
      return {
        ...state,
        data: payload.data,
        error: null,
        pageLength: payload.pageLength,
        pageIndex: payload.pageIndex,
        isLoading: false,
        state: payload.state
      };

    default:
      return state;
  }
};
