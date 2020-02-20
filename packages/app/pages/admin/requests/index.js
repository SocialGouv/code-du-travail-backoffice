import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

const COLUMNS = [
  {
    Header: "Question usager",
    accessor: "question",
  },
];

const AdminRequestsIndexPage = () => (
  <AdminIndex apiPath="/requests" columns={COLUMNS} i18nIsFeminine i18nSubject="requête" />
);

export default AdminRequestsIndexPage;
