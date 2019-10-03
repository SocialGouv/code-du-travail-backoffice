import actionTypes from "./types";

/* ONE COMMENT ――――――――――――――――――――― */

export const addOne = (value, isPrivate, answerId) => ({
  type: actionTypes.COMMENT_CREATE_ONE,
  meta: {
    answerId,
    isPrivate,
    value
  }
});
export const addOneFailure = error => ({
  type: actionTypes.COMMENT_CREATE_ONE_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});

export const toggleOnePrivacy = () => ({
  type: actionTypes.COMMENT_TOGGLE_PRIVACY
});

/* MULTIPLE COMMENTS ――――――――――――――― */

export const load = answerId => ({
  type: actionTypes.COMMENTS_LOAD,
  meta: {
    answerId
  }
});
export const loadFailure = error => ({
  type: actionTypes.COMMENTS_LOAD_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});
export const loadSuccess = data => ({
  type: actionTypes.COMMENTS_LOAD_SUCCESS,
  payload: {
    data
  }
});

export const remove = (ids, answerId) => ({
  type: actionTypes.COMMENTS_DELETE,
  meta: {
    answerId,
    ids
  }
});
export const removeFailure = error => ({
  type: actionTypes.COMMENTS_DELETE_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});
