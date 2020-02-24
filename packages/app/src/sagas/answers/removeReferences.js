import { put } from "redux-saga/effects";

import { answers } from "../../actions";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";

const API_PATH = "/answers_references";

export default function* removeReferences({ meta: { ids }, next }) {
  try {
    const request = customPostgrester().in("id", ids);

    yield request.delete(API_PATH);

    next();
  } catch (err) {
    toast.error(err.message);
    yield put(answers.removeReferencesFailure({ message: null }));
  }
}
