import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

import "../../../node_modules/react-table/react-table.css";

const CATEGORIES = {
  contract_type: "Type de contrat",
  distinctive_identity: "Particularismes",
  target: "Cible",
  theme: "Thème",
  work_schedule_type: "Type d'horaires",
  work_time: "Temps de travail"
};

const COLUMNS = [
  {
    Header: "Valeur",
    accessor: "value"
  },
  {
    Header: "Catégorie",
    accessor: data => CATEGORIES[data.category],
    id: "category",
    width: 160
  }
];

export default () => (
  <AdminIndex apiUri="/tags" columns={COLUMNS} slug="tag" title="Étiquettes" />
);
