import { apiFetch, getHeaderId } from "../utils";

export const addQuestion = async (index, value) => {
  const { headers } = await apiFetch("POST", "/questions", { index, value });

  const questionId = getHeaderId(headers.location);

  const { data: agreements } = await apiFetch("GET", "/agreements");

  return Promise.all(
    agreements
      .map(agreement =>
        apiFetch("POST", "/answers", {
          agreement_id: agreement.id,
          generic_reference: null,
          parent_id: null,
          prevalue: "",
          question_id: questionId,
          state: "draft",
          user_id: null,
          value: "",
        }),
      )
      .concat(
        apiFetch("POST", "/answers", {
          generic_reference: null,
          parent_id: null,
          prevalue: "",
          question_id: questionId,
          state: "draft",
          user_id: null,
          value: "",
        }),
      ),
  );
};
