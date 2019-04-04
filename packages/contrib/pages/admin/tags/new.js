import React from "react";

import AdminForm from "../../../src/components/AdminForm";

const FIELDS = [
  {
    type: "input",
    name: "value",
    label: "Intitulé"
  },
  {
    type: "select",
    name: "category",
    label: "Catégorie",
    options: [
      { name: "Cible", value: "target" },
      { name: "Particularismes", value: "distinctive_identity" },
      { name: "Temps de travail", value: "work_time" },
      { name: "Thème", value: "theme" },
      { name: "Type d'horaires", value: "work_schedule_type" },
      { name: "Type de contrat", value: "contract_type" }
    ]
  }
];

export default class AdminTagsNewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: FIELDS
    };
  }

  render() {
    return (
      <AdminForm
        apiPath="/tags"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des étiquettes`,
          createOrEditButton: `Bouton créant une nouvelle étiquette dans la base
                              de données à partir des données du formulaire`
        }}
        fields={this.state.fields}
        indexPath="/tags"
        title="Nouvelle étiquette"
      />
    );
  }
}
