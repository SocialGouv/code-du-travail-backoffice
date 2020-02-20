import { put } from "redux-saga/effects";

import { answers } from "../../actions";
import shortenAgreementName from "../../helpers/shortenAgreementName";
import customPostgrester from "../../libs/customPostgrester";
import toast from "../../libs/toast";

export default function* loadOne({ meta: { id, withReferences, withTags } }) {
  try {
    const request = customPostgrester()
      .select("*")
      .select("agreement(idcc,name)")
      .select("question(index,value)")
      .eq("id", id);

    const { data } = yield request.get("/answers");

    let answer = data[0];
    if (answer.agreement !== null) {
      answer.agreement = {
        ...data[0].agreement,
        name: shortenAgreementName(data[0].agreement.name),
      };
    }

    if (withReferences) {
      const request = customPostgrester()
        .eq("answer_id", answer.id)
        .orderBy("category")
        .orderBy("value");

      const { data: answerRefs } = yield request.get("/answers_references");

      answer = {
        ...answer,
        references: answerRefs,
      };
    }

    if (withTags) {
      const request = customPostgrester()
        .select("*")
        .select("tag(*)")
        .eq("answer_id", answer.id);

      const { data: answerTags } = yield request.get("/answers_tags");

      answer = {
        ...answer,
        tags: answerTags,
      };
    }

    yield put(answers.loadOneSuccess(answer));
  } catch (err) {
    toast.error(err.message);
    yield put(answers.loadOneFailure({ message: null }));
  }
}
