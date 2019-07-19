import { actionTypes } from "../actions/index";

const initialState = {
  data: [],
  error: null,
  isLoading: true,
  textareaKey: 0
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case actionTypes.COMMENTS_ADD:
    case actionTypes.COMMENTS_LOAD:
    case actionTypes.COMMENTS_REMOVE:
      return {
        ...state,
        isLoading: true
      };

    case actionTypes.COMMENTS_ADD_FAILURE:
    case actionTypes.COMMENTS_LOAD_FAILURE:
    case actionTypes.COMMENTS_REMOVE_FAILURE:
      return {
        ...state,
        error: payload.message,
        isLoading: false
      };

    case actionTypes.COMMENTS_ADD_SUCCESS:
      return {
        ...state,
        textareaKey: state.textareaKey + 1
      };

    case actionTypes.COMMENTS_LOAD_SUCCESS:
      return {
        ...state,
        data: payload.data,
        error: null,
        isLoading: false
      };

    default:
      return state;
  }
};
