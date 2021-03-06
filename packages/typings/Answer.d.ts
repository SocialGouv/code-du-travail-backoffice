declare namespace Answer {
  interface Answer {
    /** Is `null` is it's a generic answer. */
    agreement_id: string | null;
    created_at: string;
    generic_reference: "labor_code" | "national_agreement" | null;
    id: string;
    parent_id: string | null;
    prevalue: string;
    question_id: string;
    state: "draft" | "pending_review" | "published" | "todo" | "under_review" | "validated";
    updated_at: string;
    user_id: string;
    value: string;
  }

  type Reference =
    | {
        answer_id: string;
        category: "agreement" | "labor_code";
        created_at: string;
        dila_cid: string;
        dila_container_id: string;
        dila_id: string;
        id: string;
        updated_at: string;
        url: null;
        value: string;
      }
    | {
        answer_id: string;
        category: null;
        created_at: string;
        dila_cid: null;
        dila_container_id: null;
        dila_id: null;
        id: string;
        updated_at: string;
        url: string | null;
        value: string;
      };

  interface WithReferences extends Answer.Answer {
    references: Answer.Reference[];
  }
}
