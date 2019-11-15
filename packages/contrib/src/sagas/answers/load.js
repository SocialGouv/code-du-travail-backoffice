import React from "react";
import { put, select } from "redux-saga/effects";

import { answers } from "../../actions";
import { ANSWER_STATE, ANSWER_STATES, USER_ROLE } from "../../constants";
import customPostgrester from "../../libs/customPostgrester";
import getCurrentUser from "../../libs/getCurrentUser";
import toast from "../../libs/toast";
import { getAnswersFilters } from "../../selectors";

export default function* load() {
  try {
    const { agreements: userAgreements, id: userId, role: userRole } = getCurrentUser();
    const filters = yield select(getAnswersFilters);

    let request = customPostgrester();

    if (filters.page !== -1) {
      request = request.page(filters.page);
    }

    if (!filters.isGeneric) {
      const states =
        filters.states.length > 0 ? filters.states.map(({ value }) => value) : ANSWER_STATES;
      request = request.in("state", states).orderBy("question_index");

      request = request.orderBy("agreement_idcc");

      if (userRole === USER_ROLE.ADMINISTRATOR) {
        request = request.select("*").select("user(name)");
      }

      if (userRole === USER_ROLE.CONTRIBUTOR) {
        request = request.in("agreement_id", userAgreements, true);

        if (!states.includes(ANSWER_STATE.TO_DO)) {
          request = request.eq("user_id", userId);
        }
      }

      if (filters.agreements.length > 0) {
        const agreementIds = filters.agreements.map(({ value }) => value);
        request = request.in("agreement_id", agreementIds, true);
      }

      if (filters.questions.length > 0) {
        const questionIds = filters.questions.map(({ value }) => value);
        request = request.in("question_id", questionIds, true);
      }

      if (filters.query.length > 0) {
        request = request.or
          .ilike("question_value", filters.query)
          .ilike("prevalue", filters.query)
          .ilike("value", filters.query);
      }
    }

    const uri = filters.isGeneric ? "/generic_answers" : "/full_answers";
    const { data, pagesLength } = yield request.get(uri, true);

    const answerIds = data.map(({ id }) => id);
    let fullData = [...data];

    const referencesRequest = customPostgrester()
      .in("answer_id", answerIds)
      .orderBy("category")
      .orderBy("value");

    const { data: answersRefs } = yield referencesRequest.get("/answers_references");

    fullData = fullData.map(answer => ({
      ...answer,
      references: answersRefs.filter(({ answer_id }) => answer_id === answer.id)
    }));

    const tagsRequest = customPostgrester()
      .select("*")
      .select("tag(*)")
      .in("answer_id", answerIds);

    const { data: answersTags } = yield tagsRequest.get("/answers_tags");

    fullData = fullData.map(answer => ({
      ...answer,
      tags: answersTags.filter(({ answer_id }) => answer_id === answer.id)
    }));

    yield put(
      answers.loadSuccess({
        data: fullData,
        pagesLength
      })
    );
  } catch (err) {
    if (err.response.status === 416) {
      toast.error(
        <span>
          {`Cette page est hors de portée.`}
          <br />
          {`Redirection vers la première page…`}
        </span>
      );

      return yield put(answers.setFilter("page", 0));
    }

    toast.error(err.message);
    yield put(answers.loadFailure({ message: null }));
  }
}
