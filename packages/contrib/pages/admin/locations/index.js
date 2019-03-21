import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

import "../../../node_modules/react-table/react-table.css";

const COLUMNS = [
  {
    Header: "Nom",
    accessor: "name"
  }
];

export default () => (
  <AdminIndex
    apiUri="/locations"
    columns={COLUMNS}
    slug="location"
    title="Unités"
  />
);
