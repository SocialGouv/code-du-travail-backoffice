import { actionTypes } from "../actions/index";

const initialState = {
  category: null,
  data: [],
  error: null,
  isLoading: false,
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
        data: [],
        error: payload.message,
        isLoading: false,
      };

    case actionTypes.LEGAL_REFERENCES_LOAD_SUCCESS:
      return {
        ...state,
        category: payload.category,
        data: payload.data,
        error: null,
        isLoading: false,
        query: payload.query,
      };

    default:
      return state;
  }
};
