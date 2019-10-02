import actionTypes from "./types";

/* ONE ANSWER ―――――――――――――――――――――― */

export const loadOne = (
  id,
  meta = { withReferences: false, withTags: false }
) => ({
  type: actionTypes.ANSWER_LOAD_ONE,
  meta: {
    ...meta,
    id
  }
});
export const loadOneFailure = error => ({
  type: actionTypes.ANSWER_LOAD_ONE_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});
export const loadOneSuccess = data => ({
  type: actionTypes.ANSWER_LOAD_ONE_SUCCESS,
  payload: {
    data
  }
});

/* MULTIPLE ANSWERS ―――――――――――――――― */

export const cancel = (ids, next) => ({
  type: actionTypes.ANSWERS_CANCEL,
  meta: {
    ids,
    next
  }
});
export const cancelFailure = error => ({
  type: actionTypes.ANSWERS_CANCEL_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});

export const load = meta => ({
  type: actionTypes.ANSWERS_LOAD,
  meta: {
    ...{
      isGeneric: false,
      pageIndex: -1,
      query: "",
      states: [],
      withReferences: false,
      withTags: false
    },
    ...meta
  }
});
export const loadFailure = error => ({
  type: actionTypes.ANSWERS_LOAD_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});
export const loadSuccess = payload => ({
  type: actionTypes.ANSWERS_LOAD_SUCCESS,
  payload
});

export const toggleCheck = (checked, ids) => ({
  type: actionTypes.ANSWERS_TOGGLE_CHECK,
  meta: {
    checked,
    ids
  }
});
export const toggleCheckFailure = error => ({
  type: actionTypes.ANSWERS_TOGGLE_CHECK_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});

export const updateGenericReference = (ids, genericReference, next) => ({
  type: actionTypes.ANSWER_UPDATE_GENERIC_REFERENCE,
  meta: {
    genericReference,
    ids,
    next
  }
});
export const updateGenericReferenceFailure = error => ({
  type: actionTypes.ANSWER_UPDATE_GENERIC_REFERENCE_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});

export const updateIsPublished = (ids, is, next) => ({
  type: actionTypes.ANSWER_UPDATE_IS_PUBLISHED_REFERENCE,
  meta: {
    ids,
    is,
    next
  }
});
export const updateIsPublishedFailure = error => ({
  type: actionTypes.ANSWER_UPDATE_IS_PUBLISHED_REFERENCE_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});

export const updateState = (ids, state, next) => ({
  type: actionTypes.ANSWER_UPDATE_STATE,
  meta: {
    ids,
    next,
    state
  }
});
export const updateStateFailure = error => ({
  type: actionTypes.ANSWER_UPDATE_STATE_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});
