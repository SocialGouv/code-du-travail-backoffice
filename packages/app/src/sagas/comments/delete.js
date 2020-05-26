import { put } from "redux-saga/effects";

import { comments } from "../../actions";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";

const API_PATH = "/answers_comments";

export default function* _delete({ meta: { answerId, ids } }) {
  try {
    const request = customPostgrester().in("id", ids);

    yield request.delete(API_PATH);
    yield put(comments.load(answerId));
  } catch (err) /* istanbul ignore next */ {
    toast.error(err.message);
    yield put(comments.deleteFailure({ message: null }));
  }
}
