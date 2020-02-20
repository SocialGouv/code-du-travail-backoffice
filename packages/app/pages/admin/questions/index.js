import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

const COLUMNS = [
  {
    Header: "Index",
    accessor: "index",
    style: { textAlign: "right" },
    width: 80
  },
  {
    Header: "Intitulé",
    accessor: "value"
  }
];

const QuestionsIndexPage = () => (
  <AdminIndex apiPath="/questions" columns={COLUMNS} i18nIsFeminine i18nSubject="question" />
);

export default QuestionsIndexPage;
