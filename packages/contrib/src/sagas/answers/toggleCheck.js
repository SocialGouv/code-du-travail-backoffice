import * as R from "ramda";
import { put } from "redux-saga/effects";

import { actionTypes, answers } from "../../actions";
import toast from "../../libs/toast";

export default function* toggleCheck({ meta: { checked, ids } }) {
  try {
    const newChecked = R.symmetricDifference(checked, ids);

    yield put({
      type: actionTypes.ANSWERS_TOGGLE_CHECK_SUCESS,
      payload: { checked: newChecked }
    });
  } catch (err) {
    toast.error(err.message);
    yield put(answers.toggleCheckFailure({ message: null }));
  }
}
