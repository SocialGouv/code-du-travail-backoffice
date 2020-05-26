import { put } from "redux-saga/effects";

import { answers } from "../../actions";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";

const API_PATH = "/answers_references";

export default function* addReferences({ meta: { data }, next }) {
  try {
    yield customPostgrester().post(API_PATH, data);

    next();
  } catch (err) /* istanbul ignore next */ {
    toast.error(err.message);
    yield put(answers.addReferencesFailure({ message: null }));
  }
}
