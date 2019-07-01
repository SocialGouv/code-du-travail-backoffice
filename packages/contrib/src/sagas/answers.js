import React from "react";
import { put, takeLatest } from "redux-saga/effects";

import { actionTypes, answers } from "../actions";
import postgrest from "../libs/postgrest";
import toast from "../libs/toast";

import { ANSWER_STATE } from "../constants";

/**
 * Cancel an answer draft by resettinng all its related data.
 */
function* cancel({ meta: { ids, next } }) {
  try {
    const data = {
      generic_reference: null,
      prevalue: "",
      state: ANSWER_STATE.TO_DO,
      user_id: null,
      value: ""
    };

    yield postgrest()
      .in("answer_id", ids, true)
      .delete("/answers_references");

    yield postgrest()
      .in("answer_id", ids, true)
      .delete("/answers_tags");

    yield postgrest()
      .in("id", ids, true)
      .patch("/answers", data);

    toast.success(
      ids.length === 1
        ? `La réponse ${ids[0]} a été annulée.`
        : `Les réponses ${ids.join(", ")} ont été annulées.`
    );

    next();
  } catch (err) {
    toast.error(err.message);
    yield put(answers.cancelFailure({ message: null }));
  }
}

/**
 * Update an answer to make it generic.
 *
 * @description
 * A generic answer can fallback to either Labor Code or its parent national
 * agreement text.
 */
function* setGenericReference({ meta: { genericReference, ids, next } }) {
  try {
    const me = JSON.parse(sessionStorage.getItem("me"));
    const data = {
      generic_reference: genericReference,
      prevalue: "",
      state: ANSWER_STATE.DRAFT,
      user_id: me.payload.id,
      value: ""
    };

    yield postgrest()
      .in("answer_id", ids, true)
      .delete("/answers_references");

    yield postgrest()
      .in("answer_id", ids, true)
      .delete("/answers_tags");

    yield postgrest()
      .in("id", ids, true)
      .patch("/answers", data);

    toast.success(
      ids.length === 1
        ? `La réponse ${ids[0]} a été renvoyée.`
        : `Les réponses ${ids.join(", ")} ont été renvoyées.`
    );

    next();
  } catch (err) {
    toast.error(err.message);
    yield put(answers.setGenericRefenceFailure({ message: null }));
  }
}

function* load({ meta: { pageIndex, request } }) {
  const originalRequest = request.clone();

  try {
    const { data, pageLength } = yield request
      .orderBy("index")
      .orderBy("idcc")
      .page(pageIndex)
      .get("/contributor_answers", true);

    yield put(answers.loadSuccess(data, pageIndex, pageLength));
  } catch (err) {
    if (err.response.status === 416) {
      const lastPageIndex = Math.floor(
        Number(err.response.headers["content-range"].substr(2)) / 10
      );

      toast.error(
        <span>
          {`La page n° ${pageIndex + 1} est hors de portée.`}
          <br />
          {`Redirection vers la page n° ${lastPageIndex + 1}…`}
        </span>
      );

      return yield load({
        meta: { pageIndex: lastPageIndex, request: originalRequest }
      });
    }

    toast.error(err.message);
    yield put(answers.loadFailure({ message: null }));
  }
}

export default [
  takeLatest(actionTypes.ANSWERS_CANCEL, cancel),
  takeLatest(actionTypes.ANSWERS_LOAD, load),
  takeLatest(actionTypes.ANSWERS_SET_GENERIC_REFERENCE, setGenericReference)
];
