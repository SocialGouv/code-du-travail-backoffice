import { put } from "redux-saga/effects";

import { answers } from "../../actions";
import api from "../../libs/api";
import toast from "../../libs/toast";

const API_PATH = "/answers_references";

// TODO Integrate UPSERT in @socialgouv/postgrester.
export default function* updateReferences({ meta: { data }, next }) {
  try {
    yield api.post(API_PATH, data, {
      Prefer: "resolution=merge-duplicates",
    });

    next();
  } catch (err) {
    toast.error(err.message);
    yield put(answers.updateReferencesFailure({ message: null }));
  }
}
