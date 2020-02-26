import actionTypes from "./types";

const load = (category, query, idcc) => ({
  meta: {
    category,
    idcc,
    query,
  },
  type: actionTypes.LEGAL_REFERENCES_LOAD,
});
const loadFailure = error => ({
  error: true,
  payload: {
    message: error.message,
  },
  type: actionTypes.LEGAL_REFERENCES_LOAD_FAILURE,
});
const loadSuccess = payload => ({
  payload,
  type: actionTypes.LEGAL_REFERENCES_LOAD_SUCCESS,
});

export default {
  load,
  loadFailure,
  loadSuccess,
};
