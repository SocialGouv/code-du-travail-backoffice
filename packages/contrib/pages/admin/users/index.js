import React from "react";

import AdminIndex from "../../../src/components/AdminIndex";

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
    apiDeletePath="/rpc/delete_user"
    apiGetPath="/administrator_users"
    ariaLabels={{
      cancelDeletionButton: `Bouton annulant la suppression de cet utilisateur
                            de la base de données`,
      deleteButton: `Bouton confirmant la suppression de cet utilisateur de la
                    base de données`,
      editButton: `Bouton redirigeant vers le formulaire d'édition des données
                  de cet utilisateur`,
      newButton: `Bouton redirigeant vers le formulaire de création d'un nouvel
                 utilisateur`,
      removeButton: `Bouton supprimant cet utilisateur de la base de données
                    après confirmation`
    }}
    columns={COLUMNS}
    slug="user"
    title="Utilisateurs"
  />
);
