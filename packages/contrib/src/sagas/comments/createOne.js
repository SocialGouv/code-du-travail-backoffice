import { put } from "redux-saga/effects";

import { actionTypes, comments } from "../../actions";
import getCurrentUser from "../../libs/getCurrentUser";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";

const API_PATH = "/answers_comments";

export default function* createOne({ meta: { answerId, isPrivate, value } }) {
  try {
    const me = getCurrentUser();

    const request = customPostgrester();
    const data = {
      answer_id: answerId,
      is_private: isPrivate,
      user_id: me.id,
      value
    };

    yield request.post(API_PATH, data);
    yield put({ type: actionTypes.COMMENT_CREATE_ONE_SUCCESS });
    yield put(comments.load(answerId));
  } catch (err) {
    toast.error(err.message);
    yield put(comments.addOneFailure({ message: null }));
  }
}
