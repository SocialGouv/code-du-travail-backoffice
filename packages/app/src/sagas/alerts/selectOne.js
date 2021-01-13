import { put, select } from "redux-saga/effects";
import unistUtilFind from "unist-util-find";

import { alerts, answers } from "../../actions";
import toast from "../../libs/toast";
import { getAlertsTree } from "../../selectors";

export default function* selectOne({ meta: { key } }) {
  try {
    const tree = yield select(getAlertsTree);
    const answerInTree = unistUtilFind(tree, { data: { key }, type: "answer" });

    yield put(
      alerts.selectOneSuccess({
        diff: answerInTree.data.value,
        selectedKey: answerInTree.data.key,
      }),
    );
    yield put(answers.loadOne(answerInTree.data.id));
  } catch (err) /* istanbul ignore next */ {
    toast.error(err.message);
    yield put(alerts.selectOneFailure({ message: null }));
  }
}
