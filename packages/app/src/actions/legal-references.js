import actionTypes from "./types";

const load = (type, query, idcc) => ({
  meta: {
    idcc,
    query,
    type,
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
