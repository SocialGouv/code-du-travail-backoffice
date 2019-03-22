import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

import "../../../node_modules/react-table/react-table.css";

const COLUMNS = [
  {
    Header: "Nom",
    accessor: "name"
  },
  {
    Header: "E-mail",
    accessor: "email"
  },
  {
    Header: "Role",
    accessor: "role"
  },
  {
    Header: "IDCCs",
    accessor: data => data.agreements.map(({ idcc }) => idcc).join(", "),
    id: "idccs",
    width: 160
  }
];

export default () => (
  <AdminIndex
    apiUri="/administrator_users"
    columns={COLUMNS}
    slug="user"
    title="Utilisateurs"
  />
);
