import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";
import shortenAgreementName from "../../../src/helpers/shortenAgreementName";

const COLUMNS = [
  {
    Header: "Nom",
    accessor: ({ name }) => shortenAgreementName(name),
    id: "name"
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
    apiPath="/agreements"
    ariaLabels={{
      cancelDeletionButton: `Bouton annulant la suppression de cette convention
                            de la base de données`,
      deleteButton: `Bouton confirmant la suppression de cette convention de la
                    base de données`,
      editButton: `Bouton redirigeant vers le formulaire d'édition des données
                  de cette convention`,
      newButton: `Bouton redirigeant vers le formulaire de création d'une nouvel
                 nouvelle convetion`,
      removeButton: `Bouton supprimant cette convention de la base de données
                    après confirmation`
    }}
    columns={COLUMNS}
    slug="agreement"
    title="Conventions"
  />
);
