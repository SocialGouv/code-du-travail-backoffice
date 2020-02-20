import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

const COLUMNS = [
  {
    Header: "Nom",
    accessor: "name",
  },
  {
    Header: "E-mail",
    accessor: "email",
  },
  {
    Header: "Rôle",
    accessor: "role",
  },
  {
    Header: "Conventions",
    accessor: data => data.agreements.map(({ idcc }) => idcc).join(", "),
    id: "idccs",
    width: 160,
  },
];

const AdminUsersIndexPage = () => (
  <AdminIndex apiPath="/administrator_users" columns={COLUMNS} i18nSubject="utilisateur" />
);

export default AdminUsersIndexPage;
