import { actionTypes } from "../actions/index";

const initialState = {
  answerId: null,
  currentIsLoading: false,
  currentIsPrivate: false,
  currentKey: 0,
  data: [],
  error: null,
  isLoading: true,
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    /* ONE COMMENT ――――――――――――――――――――― */

    case actionTypes.COMMENT_CREATE_ONE:
      return {
        ...state,
        currentIsLoading: true,
      };

    case actionTypes.COMMENT_CREATE_ONE_FAILURE:
      return {
        ...state,
        currentIsLoading: false,
        error: payload.message,
      };

    case actionTypes.COMMENT_CREATE_ONE_SUCCESS:
      return {
        ...state,
        currentIsLoading: false,
        currentIsPrivate: false,
        currentKey: state.currentKey + 1,
      };

    case actionTypes.COMMENT_TOGGLE_PRIVACY:
      return {
        ...state,
        currentIsPrivate: !state.currentIsPrivate,
      };

    /* MULTIPLE COMMENTS ――――――――――――――― */

    case actionTypes.COMMENTS_DELETE:
    case actionTypes.COMMENTS_LOAD:
      return {
        ...state,
        isLoading: true,
      };

    case actionTypes.COMMENTS_DELETE_FAILURE:
    case actionTypes.COMMENTS_LOAD_FAILURE:
      return {
        ...state,
        error: payload.message,
        isLoading: false,
      };

    case actionTypes.COMMENTS_LOAD_SUCCESS:
      return {
        ...state,
        data: payload.data,
        error: null,
        isLoading: false,
      };

    /* DEFAULT ――――――――――――――――――――――――― */

    default:
      return state;
  }
};
