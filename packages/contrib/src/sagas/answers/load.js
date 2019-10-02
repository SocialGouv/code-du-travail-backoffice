import React from "react";
import { put } from "redux-saga/effects";

import { answers } from "../../actions";
import { ANSWER_STATE, USER_ROLE } from "../../constants";
import customPostgrester from "../../libs/customPostgrester";
import getCurrentUser from "../../libs/getCurrentUser";
import toast from "../../libs/toast";

export default function* load({
  meta: { isGeneric, pageIndex, query, states, withReferences, withTags }
}) {
  try {
    const {
      agreements: userAgreements,
      id: userId,
      role: userRole
    } = getCurrentUser();

    let request = customPostgrester();

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

    const answerIds = data.map(({ id }) => id);
    let fullData = [...data];

    if (withReferences) {
      const request = customPostgrester()
        .in("answer_id", answerIds)
        .orderBy("category")
        .orderBy("value");

      const { data: answersRefs } = yield request.get("/answers_references");

      fullData = fullData.map(answer => ({
        ...answer,
        references: answersRefs.filter(
          ({ answer_id }) => answer_id === answer.id
        )
      }));
    }

    if (withTags) {
      const request = customPostgrester()
        .select("*")
        .select("tag(*)")
        .in("answer_id", answerIds);

      const { data: answersTags } = yield request.get("/answers_tags");

      fullData = fullData.map(answer => ({
        ...answer,
        tags: answersTags.filter(({ answer_id }) => answer_id === answer.id)
      }));
    }

    yield put(
      answers.loadSuccess({
        data: fullData,
        pageIndex,
        pageLength,
        query,
        state: states[0]
      })
    );
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
