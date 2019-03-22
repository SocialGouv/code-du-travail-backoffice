import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

import "../../../node_modules/react-table/react-table.css";

const COLUMNS = [
  {
    Header: "Intitulé",
    accessor: "value"
  }
];

export default () => (
  <AdminIndex
    apiUri="/questions"
    columns={COLUMNS}
    slug="question"
    title="Questions"
  />
);
