import actionTypes from "./types";

/* MULTIPLE ANSWERS REFERENCES ――――― */

export const load = pagesIndex => ({
  meta: {
    pagesIndex,
  },
  type: actionTypes.ANSWERS_REFERENCES_LOAD,
});
export const loadFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ANSWERS_REFERENCES_LOAD_FAILURE,
});
export const loadSuccess = payload => ({
  payload,
  type: actionTypes.ANSWERS_REFERENCES_LOAD_SUCCESS,
});

export const setFilter = (key, value) => ({
  meta: {
    key,
    value,
  },
  type: actionTypes.ANSWERS_REFERENCES_SET_FILTER,
});
export const setFilterFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ANSWERS_REFERENCES_SET_FILTER_FAILURE,
});

export const setFilters = filters => ({
  meta: {
    filters,
  },
  type: actionTypes.ANSWERS_REFERENCES_SET_FILTERS,
});
export const setFiltersFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.ANSWERS_REFERENCES_SET_FILTERS_FAILURE,
});
