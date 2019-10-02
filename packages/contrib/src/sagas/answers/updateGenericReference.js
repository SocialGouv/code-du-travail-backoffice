import { put } from "redux-saga/effects";

import { answers } from "../../actions";
import getCurrentUser from "../../libs/getCurrentUser";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";

import { ANSWER_STATE, USER_ROLE } from "../../constants";

/**
 * Update answers to make them generic or not.
 *
 * @description
 * A generic answer can fallback to either Labor Code or its parent national
 * agreement text.
 */
export default function* updateGenericReference({
  meta: { genericReference, ids, next }
}) {
  try {
    const { id: userId, role: userRole } = getCurrentUser();

    const data =
      userRole === USER_ROLE.ADMINISTRATOR
        ? {
            generic_reference: genericReference,
            state: ANSWER_STATE.UNDER_REVIEW
          }
        : {
            generic_reference: genericReference,
            state: ANSWER_STATE.DRAFT,
            user_id: userId
          };

    yield customPostgrester()
      .in("id", ids, true)
      .patch("/answers", data);

    toast.success(
      ids.length === 1
        ? `La réponse ${ids[0]} a été renvoyée.`
        : `Les réponses ${ids.join(", ")} ont été renvoyées.`
    );

    next();
  } catch (err) {
    toast.error(err.message);
    yield put(answers.updateGenericReferenceFailure({ message: null }));
  }
}
