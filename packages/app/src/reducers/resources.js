import { actionTypes } from "../actions/index";

const initialState = {
  data: [],
  error: null,
  isLoading: false,
  query: "",
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case actionTypes.RESOURCES_LOAD:
      return {
        ...state,
        isLoading: true,
      };

    case actionTypes.RESOURCES_LOAD_FAILURE:
      return {
        ...state,
        data: [],
        error: payload.message,
        isLoading: false,
      };

    case actionTypes.RESOURCES_LOAD_SUCCESS:
      return {
        ...state,
        data: payload.data,
        error: null,
        isLoading: false,
        query: payload.query,
      };

    default:
      return state;
  }
};
