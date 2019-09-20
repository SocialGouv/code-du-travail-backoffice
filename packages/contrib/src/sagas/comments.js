import { put, takeLatest } from "redux-saga/effects";

import { actionTypes, comments } from "../actions";
import getCurrentUser from "../libs/getCurrentUser";
import postgrest from "../libs/postgrest";
import toast from "../libs/toast";

const API_PATH = "/answers_comments";

/* ONE COMMENT ――――――――――――――――――――― */

function* addOne({ meta: { answerId, isPrivate, value } }) {
  try {
    const me = getCurrentUser();

    const request = postgrest();
    const data = {
      answer_id: answerId,
      is_private: isPrivate,
      user_id: me.id,
      value
    };

    yield request.post(API_PATH, data);
    yield put({ type: actionTypes.COMMENT_ADD_SUCCESS });
    yield put(comments.load(answerId));
  } catch (err) {
    toast.error(err.message);
    yield put(comments.addOneFailure({ message: null }));
  }
}

/* MULTIPLE COMMENTS ――――――――――――――― */

function* load({ meta: { answerId } }) {
  try {
    const request = postgrest()
      .eq("answer_id", answerId)
      .orderBy("created_at");

    const { data } = yield request.get(API_PATH);
    yield put(comments.loadSuccess(data));
  } catch (err) {
    toast.error(err.message);
    yield put(comments.loadFailure({ message: null }));
  }
}

function* remove({ meta: { answerId, ids } }) {
  try {
    const request = postgrest().in("id", ids);

    yield request.delete(API_PATH);
    yield put(comments.load(answerId));
  } catch (err) {
    toast.error(err.message);
    yield put(comments.removeFailure({ message: null }));
  }
}

export default [
  takeLatest(actionTypes.COMMENT_ADD, addOne),

  takeLatest(actionTypes.COMMENTS_LOAD, load),
  takeLatest(actionTypes.COMMENTS_REMOVE, remove)
];
