import { put, select } from "redux-saga/effects";
import unistUtilFind from "unist-util-find";

import { alerts, answers } from "../../actions";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";
import { getAlertsSelectedKey, getAlertsTree, getAnswersData } from "../../selectors";

const hasDilaCid = dilaCid => ({ dila_cid }) => dila_cid === dilaCid;

export default function* process() {
  try {
    const answer = yield select(getAnswersData);
    const alertsSelectedKey = yield select(getAlertsSelectedKey);
    const tree = yield select(getAlertsTree);
    const answerInTree = unistUtilFind(tree, {
      data: { key: alertsSelectedKey },
      type: "answer",
    });
    const {
      data: { id: answerId },
    } = answerInTree;
    const legalReference = answerInTree.parent.data;
    const answerReference = answer.references.find(hasDilaCid(legalReference.cid));
    if (answerReference === undefined) {
      throw new Error(
        `La référence légale CID=${legalReference.cid} n'est pas attachée à cette réponse.`,
      );
    }

    // Update the answer reference:
    const updatedAnswerReference = {
      ...answerReference,
      dila_id: legalReference.id,
    };
    yield put(answers.updateReferences([updatedAnswerReference]));

    // Update processed alert in database:
    const {
      data: [alert],
    } = yield customPostgrester()
      .eq("answer_id", answerId)
      .eq("dila_id", legalReference.id)
      .get("/alerts");
    yield customPostgrester()
      .eq("answer_id", answerId)
      .eq("dila_id", legalReference.id)
      .patch("/alerts", {
        ...alert,
        is_done: true,
      });

    // Update the tree and selected alert:
    yield put(alerts.load());
  } catch (err) /* istanbul ignore next */ {
    toast.error(err.message);
    yield put(alerts.processOneFailure({ message: null }));
  }
}
