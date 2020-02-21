import { actionTypes } from "../actions/index";

const initialState = {
  data: [],
  error: null,
  isLoading: false,
  query: "",
  type: null,
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
        data: [],
        error: payload.message,
        isLoading: false,
        type: null,
      };

    case actionTypes.LEGAL_REFERENCES_LOAD_SUCCESS:
      return {
        ...state,
        data: payload.data,
        error: null,
        isLoading: false,
        query: payload.query,
        type: payload.type,
      };

    default:
      return state;
  }
};
