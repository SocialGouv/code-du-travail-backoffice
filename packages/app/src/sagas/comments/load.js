import { put } from "redux-saga/effects";

import { comments } from "../../actions";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";

const API_PATH = "/answers_comments";

export default function* load({ meta: { answerId } }) {
  try {
    const request = customPostgrester().eq("answer_id", answerId).orderBy("created_at");

    const { data: list } = yield request.get(API_PATH);

    yield put(comments.loadSuccess({ list }));
  } catch (err) /* istanbul ignore next */ {
    toast.error(err.message);
    yield put(comments.loadFailure({ message: null }));
  }
}
