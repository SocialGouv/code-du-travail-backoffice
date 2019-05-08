import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

import "../../../node_modules/react-table/react-table.css";

const COLUMNS = [
  {
    Header: "Index",
    accessor: "index"
  },
  {
    Header: "Intitulé",
    accessor: "value"
  }
];

export default () => (
  <AdminIndex
    apiPath="/questions"
    ariaLabels={{
      cancelDeletionButton: `Bouton annulant la suppression de cette question
                            de la base de données`,
      deleteButton: `Bouton confirmant la suppression de cette question de la
                    base de données`,
      editButton: `Bouton redirigeant vers le formulaire d'édition des données
                  de cette question`,
      newButton: `Bouton redirigeant vers le formulaire de création d'une
                 nouvelle question`,
      removeButton: `Bouton supprimant cette question de la base de données
                    après confirmation`
    }}
    columns={COLUMNS}
    slug="question"
    title="Questions"
  />
);
