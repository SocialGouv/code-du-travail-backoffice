import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

import "../../../node_modules/react-table/react-table.css";

const COLUMNS = [
  {
    Header: "Nom",
    accessor: "name"
  },
  {
    Header: "IDCC",
    accessor: "idcc",
    style: { textAlign: "center" },
    width: 64
  }
];

export default () => (
  <AdminIndex
    apiUri="/agreements"
    columns={COLUMNS}
    slug="agreement"
    title="Conventions"
  />
);
