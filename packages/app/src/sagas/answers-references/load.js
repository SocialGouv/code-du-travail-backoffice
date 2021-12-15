// @ts-check

import React from "react";
import { put, select } from "redux-saga/effects";

import * as actions from "../../actions";
import * as C from "../../constants";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";
import { getAnswersReferencesFilters } from "../../selectors";

export default function* load({ meta: { pagesIndex } }) {
  try {
    const filters = yield select(getAnswersReferencesFilters);
    const { category, states } = filters;
    const request = customPostgrester();

    request.select("*").page(pagesIndex, filters.pageLength);

    if (category === C.ANSWER_REFERENCE_CATEGORY.OTHER) {
      request.is("category", null);
    } else {
      request.eq("category", category);
    }

    if (states.length > 0) {
      if (
        states.includes(C.ANSWER_REFERENCE_STATE.IS_LINKED) &&
        !states.includes(C.ANSWER_REFERENCE_STATE.NOT_IS_LINKED)
      ) {
        request.not.is("dila_id", null);
      }
      if (
        states.includes(C.ANSWER_REFERENCE_STATE.NOT_IS_LINKED) &&
        !states.includes(C.ANSWER_REFERENCE_STATE.IS_LINKED)
      ) {
        request.is("dila_id", null);
      }
    }

    if (filters.query.length > 0) {
      request.ilike("value", filters.query);
    }

    /** @type {{ data: Answer.Reference[]; pagesLength: number; totalLength: number; }} */
    // eslint-disable-next-line prettier/prettier
    const {
      data: answersReferences,
      pagesLength,
      totalLength,
    } = yield request.get("/answers_references", true);

    const answerIds = answersReferences.map(({ answer_id }) => answer_id);

    const { data: answers } = yield customPostgrester()
      .select("id")
      .select("agreement:agreements!answers_agreement_id_fkey(idcc,name)")
      .select("question:questions!answers_question_id_fkey(index, value)")
      .in("id", answerIds)
      .not.is("agreement_id", null)
      .get("/answers");
    const { data: genericAnswers } = yield customPostgrester()
      .select("id")
      .select("question:questions!answers_question_id_fkey(index, value)")
      .in("id", answerIds)
      .is("agreement_id", null)
      .get("/answers");

    yield put(
      actions.answersReferences.loadSuccess({
        answers: [...answers, ...genericAnswers],
        length: totalLength,
        list: answersReferences,
        pagesIndex,
        pagesLength,
      }),
    );
  } catch (err) /* istanbul ignore next */ {
    if (err.response !== undefined && err.response.status === 416) {
      toast.error(
        <span>
          {`Cette page est hors de portée.`}
          <br />
          {`Redirection vers la première page…`}
        </span>,
      );

      return yield put(actions.answersReferences.setFilter("page", 0));
    }

    toast.error(err.message);
    yield put(actions.answersReferences.loadFailure({ message: null }));
  }
}
