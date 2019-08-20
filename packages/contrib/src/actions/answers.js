import actionTypes from "./types";

/* ONE ANSWER ―――――――――――――――――――――― */

export const loadOne = id => ({
  type: actionTypes.ANSWER_LOAD_ONE,
  meta: {
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

export const load = (states, pageIndex, query, isGeneric) => ({
  type: actionTypes.ANSWERS_LOAD,
  meta: {
    isGeneric,
    query,
    pageIndex,
    states
  }
});
export const loadFailure = error => ({
  type: actionTypes.ANSWERS_LOAD_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});
export const loadSuccess = (data, pageIndex, pageLength, state) => ({
  type: actionTypes.ANSWERS_LOAD_SUCCESS,
  payload: {
    data,
    pageIndex,
    pageLength,
    state
  }
});

export const setGenericRefence = (ids, genericReference, next) => ({
  type: actionTypes.ANSWERS_SET_GENERIC_REFERENCE,
  meta: {
    genericReference,
    ids,
    next
  }
});
export const setGenericRefenceFailure = error => ({
  type: actionTypes.ANSWERS_SET_GENERIC_REFERENCE_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});

export const setState = (ids, state, next) => ({
  type: actionTypes.ANSWERS_SET_STATE,
  meta: {
    ids,
    next,
    state
  }
});
export const setStateFailure = error => ({
  type: actionTypes.ANSWERS_SET_STATE_FAILURE,
  error: true,
  payload: {
    message: error.message
  }
});
