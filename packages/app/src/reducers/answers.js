import { actionTypes } from "../actions/index";

export const initialState = {
  checked: [],
  data: null,
  error: null,
  filters: {
    agreements: [],
    isGeneric: false,
    pageLength: 10,
    query: "",
    questions: [],
    states: [],
  },
  isLoading: true,
  length: 0,
  list: [],
  pagesIndex: 0,
  pagesLength: 0,
};

const AnswersReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    /* ONE ANSWER ―――――――――――――――――――――― */

    case actionTypes.ANSWER_LOAD_ONE:
      return {
        ...state,
        isLoading: true,
      };

    case actionTypes.ANSWER_LOAD_ONE_FAILURE:
      return {
        ...state,
        error: payload.message,
        isLoading: false,
      };

    case actionTypes.ANSWER_LOAD_ONE_SUCCESS:
      return {
        ...state,
        data: payload.data,
        isLoading: false,
      };

    /* MULTIPLE ANSWERS ―――――――――――――――― */

    case actionTypes.ANSWERS_ADD_REFERENCES:
    case actionTypes.ANSWERS_CANCEL:
    case actionTypes.ANSWERS_LOAD:
    case actionTypes.ANSWERS_REMOVE_REFERENCES:
    case actionTypes.ANSWERS_SET_FILTER:
    case actionTypes.ANSWERS_SET_FILTERS:
    case actionTypes.ANSWERS_UPDATE_GENERIC_REFERENCE:
    case actionTypes.ANSWERS_UPDATE_REFERENCES:
    case actionTypes.ANSWERS_UPDATE_STATE:
      return {
        ...state,
        isLoading: true,
      };

    case actionTypes.ANSWERS_ADD_REFERENCES_FAILURE:
    case actionTypes.ANSWERS_CANCEL_FAILURE:
    case actionTypes.ANSWERS_LOAD_FAILURE:
    case actionTypes.ANSWERS_REMOVE_REFERENCES_FAILURE:
    case actionTypes.ANSWERS_SET_FILTER_FAILURE:
    case actionTypes.ANSWERS_SET_FILTERS_FAILURE:
    case actionTypes.ANSWERS_TOGGLE_CHECK_FAILURE:
    case actionTypes.ANSWERS_UPDATE_GENERIC_REFERENCE_FAILURE:
    case actionTypes.ANSWERS_UPDATE_REFERENCES_FAILURE:
    case actionTypes.ANSWERS_UPDATE_STATE_FAILURE:
      return {
        ...state,
        error: payload.message,
        isLoading: false,
      };

    case actionTypes.ANSWERS_LOAD_SUCCESS:
      return {
        ...state,
        checked: [],
        error: null,
        isLoading: false,
        length: payload.length,
        list: payload.list,
        pagesIndex: payload.pagesIndex,
        pagesLength: payload.pagesLength,
      };

    case actionTypes.ANSWERS_SET_FILTER_SUCCESS:
    case actionTypes.ANSWERS_SET_FILTERS_SUCCESS:
      return {
        ...state,
        filters: payload.filters,
      };

    case actionTypes.ANSWERS_TOGGLE_CHECK_SUCESS:
      return {
        ...state,
        checked: payload.checked,
      };

    case actionTypes.ANSWERS_TOGGLE_IS_LOADING:
      return {
        ...state,
        isLoading: !state.isLoading,
      };

    default:
      return state;
  }
};

export default AnswersReducer;
