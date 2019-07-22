import { actionTypes } from "../actions/index";

const initialState = {
  answerId: null,
  currentIsLoading: false,
  currentIsPrivate: false,
  currentKey: 0,
  data: [],
  error: null,
  isLoading: true
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    /* ONE COMMENT ――――――――――――――――――――― */

    case actionTypes.COMMENT_ADD:
      return {
        ...state,
        currentIsLoading: true
      };

    case actionTypes.COMMENT_ADD_FAILURE:
      return {
        ...state,
        error: payload.message,
        currentIsLoading: false
      };

    case actionTypes.COMMENT_ADD_SUCCESS:
      return {
        ...state,
        currentIsLoading: false,
        currentIsPrivate: false,
        currentKey: state.currentKey + 1
      };

    case actionTypes.COMMENT_TOGGLE_PRIVACY:
      return {
        ...state,
        currentIsPrivate: !state.currentIsPrivate
      };

    /* MULTIPLE COMMENTS ――――――――――――――― */

    case actionTypes.COMMENTS_LOAD:
    case actionTypes.COMMENTS_REMOVE:
      return {
        ...state,
        isLoading: true
      };

    case actionTypes.COMMENTS_LOAD_FAILURE:
    case actionTypes.COMMENTS_REMOVE_FAILURE:
      return {
        ...state,
        error: payload.message,
        isLoading: false
      };

    case actionTypes.COMMENTS_LOAD_SUCCESS:
      return {
        ...state,
        data: payload.data,
        error: null,
        isLoading: false
      };

    /* DEFAULT ――――――――――――――――――――――――― */

    default:
      return state;
  }
};
