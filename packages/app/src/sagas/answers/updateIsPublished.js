import { put } from "redux-saga/effects";

import { answers } from "../../actions";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";

/**
 * Publish/unpublish answers.
 */
export default function* updateIsPublished({ meta: { ids, is, next } }) {
  try {
    const data = {
      is_published: is,
    };

    yield customPostgrester().in("id", ids, true).patch("/answers", data);

    toast.success(
      ids.length === 1
        ? `La réponse ${ids[0]} a été ${is ? "" : "dé"}publiée.`
        : `Les réponses ${ids.join(", ")} ont été ${is ? "" : "dé"}publiées.`,
    );

    next();
  } catch (err) /* istanbul ignore next */ {
    toast.error(err.message);
    yield put(answers.updateIsPublishedFailure({ message: null }));
  }
}
