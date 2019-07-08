import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

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
  <AdminIndex
    apiPath="/tags"
    ariaLabels={{
      cancelDeletionButton: `Bouton annulant la suppression de cette étiquette
                            de la base de données`,
      deleteButton: `Bouton confirmant la suppression de cette étiquette de la
                    base de données`,
      editButton: `Bouton redirigeant vers le formulaire d'édition des données
                  de cette étiquette`,
      newButton: `Bouton redirigeant vers le formulaire de création d'une
                 nouvelle étiquette`,
      removeButton: `Bouton supprimant cette étiquette de la base de données
                    après confirmation`
    }}
    columns={COLUMNS}
    slug="tag"
    title="Étiquettes"
  />
);
