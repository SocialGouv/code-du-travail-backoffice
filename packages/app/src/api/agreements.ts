import { apiFetch, getHeaderId } from "../utils";

export const addAgreement = async (name: string, idcc: string, parent_id?: string) => {
  const { headers } = await apiFetch("POST", "/agreements", {
    idcc,
    name,
    parent_id,
  });

  const agreementId = getHeaderId(headers.location);

  const { data: questions } = await apiFetch("GET", "/questions");

  return Promise.all(
    questions.map(question =>
      apiFetch("POST", "/answers", {
        agreement_id: agreementId,
        question_id: question.id,
        state: "draft",
        user_id: null,
        parent_id: null,
        prevalue: "",
        generic_reference: null,
        value: "",
      }),
    ),
  );
};
