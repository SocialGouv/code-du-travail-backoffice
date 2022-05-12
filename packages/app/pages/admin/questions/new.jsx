import { useRouter } from "next/router";
import React from "react";

import { addQuestion } from "../../../src/api";
import AdminForm from "../../../src/components/AdminForm";

const FIELDS = [
  {
    inputType: "number",
    label: "Index",
    name: "index",
    type: "input",
  },
  {
    label: "Intitulé",
    name: "value",
    type: "text",
  },
];

export default function AdminNew() {
  const { back } = useRouter();
  const [isSubmitting, submitting] = React.useState(false);
  const [error, setError] = React.useState();

  const onSubmit = async data => {
    try {
      submitting(true);
      setError(null);
      await addQuestion(data.index, data.value);
      back();
    } catch (err) {
      if (
        err !== undefined &&
        err.response !== undefined &&
        err.response.data !== undefined &&
        typeof err.response.data.message === "string"
      ) {
        setError(`Erreur: ${err.response.data.message}.`);
      } else {
        setError(`Erreur: ${err}`);
        if (err !== undefined) console.warn(err);
      }
    } finally {
      submitting(false);
    }
  };

  return (
    <AdminForm
      isSubmitting={isSubmitting}
      apiPath="/questions"
      fields={FIELDS}
      i18nIsFeminine={true}
      i18nSubject="question"
      indexPath="/questions"
      onSubmit={onSubmit}
      error={error}
    />
  );
}
