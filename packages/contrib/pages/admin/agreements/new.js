import React from "react";

import AdminForm from "../../../src/components/AdminForm";

const FIELDS = [
  {
    type: "input",
    name: "name",
    label: "Nom"
  },
  {
    type: "input",
    name: "idcc",
    label: "IDCC"
  }
];

export default class AdminAgreementsNewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: FIELDS
    };
  }

  render() {
    return (
      <AdminForm
        apiPath="/agreements"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des conventions`,
          createOrEditButton: `Bouton créant une nouvelle convention dans la
                              base de données à partir des données du
                              formulaire`
        }}
        fields={this.state.fields}
        indexPath="/agreements"
        title="Nouvelle convention"
      />
    );
  }
}
