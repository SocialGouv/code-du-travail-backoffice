import { put } from "redux-saga/effects";

import { answers } from "../../actions";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";

export default function* updateReferences({ meta: { data }, next }) {
  try {
    const request = customPostgrester();
    yield request.post("/answers_references", data);

    if (next !== undefined) {
      next();
    }
  } catch (err) /* istanbul ignore next */ {
    toast.error(err.message);
    yield put(answers.updateReferencesFailure({ message: null }));
  }
}
