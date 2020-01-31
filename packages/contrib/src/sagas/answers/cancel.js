import { put } from "redux-saga/effects";

import { answers } from "../../actions";
import { ANSWER_STATE } from "../../constants";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";

/**
 * Cancel an answer draft by resettinng all its related data.
 *
 * TODO Replace this saga by `updateState()` one.
 */
export default function* cancel({ meta: { ids, next } }) {
  try {
    const data = {
      generic_reference: null,
      prevalue: "",
      state: ANSWER_STATE.TO_DO,
      user_id: null,
      value: ""
    };

    yield customPostgrester()
      .in("answer_id", ids, true)
      .delete("/answers_references");

    yield customPostgrester()
      .in("answer_id", ids, true)
      .delete("/answers_tags");

    yield customPostgrester()
      .in("id", ids, true)
      .patch("/answers", data);

    toast.success(
      ids.length === 1
        ? `La réponse ${ids[0]} a été annulée.`
        : `Les réponses ${ids.join(", ")} ont été annulées.`
    );

    next();
  } catch (err) {
    toast.error(err.message);
    yield put(answers.cancelFailure({ message: null }));
  }
}
