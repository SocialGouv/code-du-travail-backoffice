import { put, takeLatest } from "redux-saga/effects";

import { actionTypes } from "../actions";
import toast from "../libs/toast";

let ACTION = resetAction();

function resetAction() {
  return () => {
    throw new Error(`Action non définie.`);
  };
}

function open({ meta: { action } }) {
  ACTION = action;
}

function* submit() {
  try {
    yield put(ACTION());
  } catch (err) {
    toast.error(err.message);
  }

  // eslint-disable-next-line require-atomic-updates
  ACTION = resetAction();
}

export default [
  takeLatest(actionTypes.MODAL_OPEN, open),
  takeLatest(actionTypes.MODAL_SUBMIT, submit)
];
