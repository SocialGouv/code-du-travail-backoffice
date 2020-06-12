import { actionTypes } from "../actions/index";

export const initialState = {
  answers: [],
  data: null,
  error: null,
  filters: {
    category: "agreement",
    pageLength: 10,
    query: "",
    states: [],
  },
  isLoading: true,
  length: 0,
  list: [],
  pagesIndex: 0,
  pagesLength: 0,
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    /* MULTIPLE ANSWERS REFERENCES ――――― */

    case actionTypes.ANSWERS_REFERENCES_LOAD:
    case actionTypes.ANSWERS_REFERENCES_SET_FILTER:
    case actionTypes.ANSWERS_REFERENCES_SET_FILTERS:
      return {
        ...state,
        isLoading: true,
      };

    case actionTypes.ANSWERS_REFERENCES_LOAD_FAILURE:
    case actionTypes.ANSWERS_REFERENCES_SET_FILTER_FAILURE:
    case actionTypes.ANSWERS_REFERENCES_SET_FILTERS_FAILURE:
      return {
        ...state,
        error: payload.message,
        isLoading: false,
      };

    case actionTypes.ANSWERS_REFERENCES_LOAD_SUCCESS:
      return {
        ...state,
        answers: payload.answers,
        checked: [],
        error: null,
        isLoading: false,
        length: payload.length,
        list: payload.list,
        pagesIndex: payload.pagesIndex,
        pagesLength: payload.pagesLength,
      };

    case actionTypes.ANSWERS_REFERENCES_SET_FILTER_SUCCESS:
    case actionTypes.ANSWERS_REFERENCES_SET_FILTERS_SUCCESS:
      return {
        ...state,
        filters: payload.filters,
      };

    default:
      return state;
  }
};
