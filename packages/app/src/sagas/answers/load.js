// @ts-check

import React from "react";
import { put, select } from "redux-saga/effects";

import * as actions from "../../actions";
import { ANSWER_STATE, ANSWER_STATES, USER_ROLE } from "../../constants";
import shortenAgreementName from "../../helpers/shortenAgreementName";
import customPostgrester from "../../libs/customPostgrester";
import getCurrentUser from "../../libs/getCurrentUser";
import toast from "../../libs/toast";
import { getAnswersFilters } from "../../selectors";

export default function* load() {
  try {
    const { agreements: userAgreements, id: userId, role: userRole } = getCurrentUser();
    const filters = yield select(getAnswersFilters);
    const request = customPostgrester();

    request
      .select("*")
      .select("agreement(*)")
      .select("question(*)")
      .select("user(*)")
      .page(filters.page, filters.pageLength);

    if (!filters.isGeneric) {
      const states =
        filters.states.length > 0 ? filters.states.map(({ value }) => value) : ANSWER_STATES;
      request.in("state", states).orderBy("question.index");

      if (userRole === USER_ROLE.CONTRIBUTOR) {
        request.in("agreement_id", userAgreements, true);

        if (!states.includes(ANSWER_STATE.TO_DO)) {
          request.eq("user_id", userId);
        }
      }

      if (filters.agreements.length > 0) {
        const agreementIds = filters.agreements.map(({ value }) => value);
        request.in("agreement_id", agreementIds, true);
      }

      if (filters.questions.length > 0) {
        const questionIds = filters.questions.map(({ value }) => value);
        request.in("question_id", questionIds, true);
      }

      if (filters.query.length > 0) {
        request.or
          .ilike("question_value", filters.query)
          .ilike("prevalue", filters.query)
          .ilike("value", filters.query);
      }
    } else {
      request.is("agreement_id", null);
    }

    request.orderBy("agreement.idcc").orderBy("question.index");

    /** @type {{ data: Answer.Answer[]; pagesLength: number; }} */
    const { data: answers, pagesLength } = yield request.get("/answers", true);

    const answerIds = answers.map(({ id }) => id);

    const referencesRequest = customPostgrester()
      .in("answer_id", answerIds)
      .orderBy("category")
      .orderBy("value");

    /** @type {{ data: Answer.Reference[]; }} */
    const { data: answersReferences } = yield referencesRequest.get("/answers_references");

    const answersWithReferences = answers.map(answer => ({
      ...answer,
      references: answersReferences.filter(({ answer_id }) => answer_id === answer.id),
    }));

    if (filters.isGeneric) {
      yield put(
        actions.answers.loadSuccess({
          data: answersWithReferences,
          pagesLength,
        }),
      );

      return;
    }

    const answersWithReferencesAndShortAgreementName = answersWithReferences.map(
      ({ agreement, ...props }) => ({
        ...props,
        agreement: {
          ...agreement,
          name: shortenAgreementName(agreement.name),
        },
      }),
    );

    yield put(
      actions.answers.loadSuccess({
        data: answersWithReferencesAndShortAgreementName,
        pagesLength,
      }),
    );
  } catch (err) {
    if (err.response.status === 416) {
      toast.error(
        <span>
          {`Cette page est hors de portée.`}
          <br />
          {`Redirection vers la première page…`}
        </span>,
      );

      return yield put(actions.answers.setFilter("page", 0));
    }

    toast.error(err.message);
    yield put(actions.answers.loadFailure({ message: null }));
  }
}
