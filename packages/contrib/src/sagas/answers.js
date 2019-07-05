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

function* setState({ meta: { ids, next, state } }) {
  try {
    const data = { state };

    yield postgrest()
      .in("id", ids, true)
      .patch("/answers", data);

    if (state === ANSWER_STATE.PENDING_REVIEW) {
      toast.success(
        ids.length === 1
          ? `La réponse ${ids[0]} a été envoyée en validation.`
          : `Les réponses ${ids.join(", ")} ont été envoyées en validation.`
      );
    } else if (state === ANSWER_STATE.VALIDATED) {
      toast.success(
        ids.length === 1
          ? `La réponse ${ids[0]} a été validée.`
          : `Les réponses ${ids.join(", ")} ont été validées.`
      );
    } else {
      throw new Error(`Ce changement d'état est impossible.`);
    }

    next();
  } catch (err) {
    toast.error(err.message);
    yield put(answers.setStateFailure({ message: null }));
  }
}

function* load({ meta: { pageIndex, query, states } }) {
  try {
    const me = JSON.parse(sessionStorage.getItem("me"));
    const queryAsNumber = isNaN(query) ? 0 : Number(query);

    let request = postgrest()
      .page(pageIndex)
      .in("state", states)
      .in("agreement_id", me.payload.agreements, true)
      .orderBy("question_index")
      .orderBy("agreement_idcc");

    if (!states.includes(ANSWER_STATE.TO_DO)) {
      request = request.eq("user_id", me.payload.id);
    }

    if (query.length > 0) {
      request = request.or
        .eq("agreement_idcc", queryAsNumber)
        .ilike("agreement_name", query)
        .eq("question_index", queryAsNumber)
        .ilike("question_value", query);
    }

    const { data, pageLength } = yield request.get("/full_answers", true);

    yield put(answers.loadSuccess(data, pageIndex, pageLength));
  } catch (err) {
    if (err.response.status === 416) {
      const pageIndex = Math.floor(
        Number(err.response.headers["content-range"].substr(2)) / 10
      );

      toast.error(
        <span>
          {`Cette page est hors de portée.`}
          <br />
          {`Redirection vers la page n° ${pageIndex + 1}…`}
        </span>
      );

      return yield load({ meta: { pageIndex, query, states } });
    }

    toast.error(err.message);
    yield put(answers.loadFailure({ message: null }));
  }
}

export default [
  takeLatest(actionTypes.ANSWERS_CANCEL, cancel),
  takeLatest(actionTypes.ANSWERS_LOAD, load),
  takeLatest(actionTypes.ANSWERS_SET_GENERIC_REFERENCE, setGenericReference),
  takeLatest(actionTypes.ANSWERS_SET_STATE, setState)
];
