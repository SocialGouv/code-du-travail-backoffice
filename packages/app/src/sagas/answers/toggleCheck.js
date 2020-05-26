import * as R from "ramda";
import { put, select } from "redux-saga/effects";

import { actionTypes, answers } from "../../actions";
import toast from "../../libs/toast";
import { getAnswersChecked } from "../../selectors";

export default function* toggleCheck({ meta: { ids } }) {
  try {
    const checkedIds = yield select(getAnswersChecked);
    const newChecked = R.symmetricDifference(checkedIds, ids);

    yield put({
      payload: { checked: newChecked },
      type: actionTypes.ANSWERS_TOGGLE_CHECK_SUCESS,
    });
  } catch (err) /* istanbul ignore next */ {
    toast.error(err.message);
    yield put(answers.toggleCheckFailure({ message: null }));
  }
}
