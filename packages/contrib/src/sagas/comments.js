import { put, takeLatest } from "redux-saga/effects";

import { actionTypes, comments } from "../actions";
import postgrest from "../libs/postgrest";
import toast from "../libs/toast";

const API_PATH = "/answers_comments";

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

function* add({ meta: { answerId, value } }) {
  try {
    const me = JSON.parse(sessionStorage.getItem("me"));

    const request = postgrest();
    const data = {
      answer_id: answerId,
      user_id: me.payload.id,
      value
    };

    yield request.post(API_PATH, data);
    yield put({ type: actionTypes.COMMENTS_ADD_SUCCESS });
    yield put(comments.load(answerId));
  } catch (err) {
    toast.error(err.message);
    yield put(comments.addFailure({ message: null }));
  }
}

function* remove({ meta: { answerId, id } }) {
  try {
    const request = postgrest().eq("id", id);

    yield request.delete(API_PATH);
    yield put(comments.load(answerId));
  } catch (err) {
    toast.error(err.message);
    yield put(comments.addFailure({ message: null }));
  }
}

export default [
  takeLatest(actionTypes.COMMENTS_ADD, add),
  takeLatest(actionTypes.COMMENTS_LOAD, load),
  takeLatest(actionTypes.COMMENTS_REMOVE, remove)
];
