// @ts-check

import React from "react";
import { put, select } from "redux-saga/effects";

import * as actions from "../../actions";
import { ANSWER_STATES, USER_ROLE } from "../../constants";
import shortenAgreementName from "../../helpers/shortenAgreementName";
import customPostgrester from "../../libs/customPostgrester";
import getCurrentUser from "../../libs/getCurrentUser";
import toast from "../../libs/toast";
import { getAnswersFilters } from "../../selectors";

export default function* load({ meta: { pagesIndex } }) {
  try {
    const { agreements: userAgreementIds, role: userRole } = getCurrentUser();
    const filters = yield select(getAnswersFilters);
    const request = customPostgrester();

    request.select("*").page(pagesIndex, filters.pageLength);

    if (!filters.isGeneric) {
      request.not.is("agreement_id", null);

      const states =
        filters.states.length > 0 ? filters.states.map(({ value }) => value) : ANSWER_STATES;
      request.in("state", states);

      if (filters.agreements.length > 0) {
        const selectedAgreementIds = filters.agreements.map(({ value }) => value);
        const allowedSelectedAgreementIds =
          userRole === USER_ROLE.ADMINISTRATOR
            ? selectedAgreementIds
            : selectedAgreementIds.filter(id => userAgreementIds.includes(id));

        request.in("agreement_id", allowedSelectedAgreementIds, true);
      } else if (userRole === USER_ROLE.CONTRIBUTOR) {
        request.in("agreement_id", userAgreementIds, true);
      }

      if (userRole === USER_ROLE.ADMINISTRATOR) {
        if (filters.agreements.length > 0) {
          const agreementIds = filters.agreements.map(({ value }) => value);
          request.in("agreement_id", agreementIds, true);
        }
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

    request.orderBy("question_index");
    request.orderBy("agreement_idcc");

    /** @type {{ data: FullAnswer.Answer[]; pagesLength: number; totalLength: number; }} */
    const { data: answers, pagesLength, totalLength } = yield request.get("/full_answers", true);

    const answerIds = answers.map(({ id }) => id);

    const referencesRequest = customPostgrester()
      .in("answer_id", answerIds)
      .orderBy("category")
      .orderBy("value");

    /** @type {{ data: Answer.Reference[]; }} */
    const { data: answersReferences } = yield referencesRequest.get("/answers_references");

    /** @type {FullAnswer.WithReferences[]} */
    const answersWithReferences = answers
      .map(answer => ({
        ...answer,
        references: answersReferences.filter(({ answer_id }) => answer_id === answer.id),
      }))
      .map(({ agreement_name, ...props }) => ({
        ...props,
        agreement_name: agreement_name !== null ? shortenAgreementName(agreement_name) : null,
      }));

    yield put(
      actions.answers.loadSuccess({
        length: totalLength,
        list: answersWithReferences,
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

      return yield put(actions.answers.setFilter("page", 0));
    }

    toast.error(err.message);
    yield put(actions.answers.loadFailure({ message: null }));
  }
}
