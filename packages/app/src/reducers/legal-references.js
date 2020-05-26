import { actionTypes } from "../actions/index";

export const initialState = {
  category: null,
  data: null,
  error: null,
  isLoading: false,
  list: [],
  query: "",
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    /* MULTIPLE LEGAL REFERENCES ―――――――― */

    case actionTypes.LEGAL_REFERENCES_LOAD:
      return {
        ...state,
        isLoading: true,
      };

    case actionTypes.LEGAL_REFERENCES_LOAD_FAILURE:
      return {
        ...state,
        category: null,
        error: payload.message,
        isLoading: false,
        list: [],
      };

    case actionTypes.LEGAL_REFERENCES_LOAD_SUCCESS:
      return {
        ...state,
        category: payload.category,
        error: null,
        isLoading: false,
        list: payload.list,
        query: payload.query,
      };

    default:
      return state;
  }
};
