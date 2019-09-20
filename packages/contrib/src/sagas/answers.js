import * as R from "ramda";
import React from "react";
import { put, takeLatest } from "redux-saga/effects";

import { actionTypes, answers } from "../actions";
import getCurrentUser from "../libs/getCurrentUser";
import postgrest from "../libs/postgrest";
import toast from "../libs/toast";

import { ANSWER_STATE, ANSWER_STATE_LABEL, USER_ROLE } from "../constants";
import { pluralize } from "../texts";

/* ONE ANSWER ―――――――――――――――――――――― */

function* loadOne({ meta: { id } }) {
  try {
    const request = postgrest()
      .select("*")
      .select("agreement(idcc,name)")
      .select("question(index,value)")
      .eq("id", id);

    const { data } = yield request.get("/answers");

    yield put(answers.loadOneSuccess(data));
  } catch (err) {
    toast.error(err.message);
    yield put(answers.loadOneFailure({ message: null }));
  }
}

/* MULTIPLE ANSWERS ―――――――――――――――― */

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
    const { id: userId, role: userRole } = getCurrentUser();

    const data =
      userRole === USER_ROLE.ADMINISTRATOR
        ? {
            generic_reference: genericReference,
            state: ANSWER_STATE.UNDER_REVIEW
          }
        : {
            generic_reference: genericReference,
            state: ANSWER_STATE.DRAFT,
            user_id: userId
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
    let data;

    switch (state) {
      case ANSWER_STATE.TO_DO:
        data = {
          generic_reference: null,
          prevalue: "",
          state,
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
            ? `La réponse ${ids[0]} a été ré-initialisée.`
            : `Les réponses ${ids.join(", ")} ont été ré-initialisée.`
        );

        break;

      case ANSWER_STATE.DRAFT:
      case ANSWER_STATE.PENDING_REVIEW:
      case ANSWER_STATE.UNDER_REVIEW:
      case ANSWER_STATE.VALIDATED:
        data = { state };
        yield postgrest()
          .in("id", ids, true)
          .patch("/answers", data);

        toast.success(
          ids.length === 1
            ? `La réponse ${ids[0]} est maintenant ${
                ANSWER_STATE_LABEL[state]
              }.`
            : `Les réponses ${ids.join(", ")} sont maintenant ${pluralize(
                ANSWER_STATE_LABEL[state]
              )}.`
        );

        break;

      default:
        throw new Error(`Ce changement d'état est impossible.`);
    }

    next();
  } catch (err) {
    toast.error(err.message);
    yield put(answers.setStateFailure({ message: null }));
  }
}

function* load({ meta: { isGeneric, pageIndex, query, states } }) {
  try {
    const {
      agreements: userAgreements,
      id: userId,
      role: userRole
    } = getCurrentUser();

    let request = postgrest();

    if (pageIndex !== -1) {
      request = request.page(pageIndex);
    }

    request = request.in("state", states).orderBy("question_index");

    if (!isGeneric) {
      request = request.orderBy("agreement_idcc");
    }

    if (userRole === USER_ROLE.ADMINISTRATOR && !isGeneric) {
      request = request.select("*").select("user(name)");
    }

    if (userRole === USER_ROLE.CONTRIBUTOR) {
      if (!isGeneric) {
        request = request.in("agreement_id", userAgreements, true);
      }

      if (!states.includes(ANSWER_STATE.TO_DO)) {
        request = request.eq("user_id", userId);
      }
    }

    if (query.length > 0) {
      if (isGeneric) {
        request = request.or.ilike("question_value", query);
      } else {
        request = request.or
          .ilike("agreement_name", query)
          .ilike("question_value", query);
      }

      if (!isNaN(query)) {
        if (isGeneric) {
          request = request.or.eq("question_index", Number(query));
        } else {
          request = request.or
            .eq("agreement_idcc", query.padStart(4, "0"), true)
            .eq("question_index", Number(query));
        }
      }
    }

    const uri = isGeneric ? "/generic_answers" : "/full_answers";
    const { data, pageLength } = yield request.get(uri, true);

    yield put(answers.loadSuccess(data, pageIndex, pageLength, states[0]));
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

function* toggleCheck({ meta: { checked, ids } }) {
  try {
    const newChecked = R.symmetricDifference(checked, ids);

    yield put({
      type: actionTypes.ANSWERS_TOGGLE_CHECK_SUCESS,
      payload: { checked: newChecked }
    });
  } catch (err) {
    toast.error(err.message);
    yield put(answers.toggleCheckFailure({ message: null }));
  }
}

export default [
  takeLatest(actionTypes.ANSWER_LOAD_ONE, loadOne),
  takeLatest(actionTypes.ANSWERS_CANCEL, cancel),
  takeLatest(actionTypes.ANSWERS_LOAD, load),
  takeLatest(actionTypes.ANSWERS_SET_GENERIC_REFERENCE, setGenericReference),
  takeLatest(actionTypes.ANSWERS_SET_STATE, setState),
  takeLatest(actionTypes.ANSWERS_TOGGLE_CHECK, toggleCheck)
];
