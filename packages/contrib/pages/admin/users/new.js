import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMain from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";
import generatePassword from "../../../src/libs/generatePassword";

const PASSWORD_LENGTH = 16;

const FIELDS = [
  {
    type: "input",
    name: "name",
    label: "Nom"
  },
  {
    type: "select",
    name: "role",
    label: "Rôle",
    options: [
      { name: "Administrateur", value: "administrator" },
      { name: "Contributeur", value: "contributor" }
    ]
  },
  {
    type: "input",
    name: "email",
    label: "E-mail",
    inputType: "email"
  },
  {
    type: "input",
    name: "password",
    label: "Mot-de-passe",
    button: {
      ariaLabel: "Bouton générant un mot de passe aléatoire",
      icon: "sync",
      handler: () => generatePassword(PASSWORD_LENGTH)
    }
  }
];

export default class AdminUsersNewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: [],
      isLoading: true
    };
  }

  async componentDidMount() {
    this.axios = customAxios();

    try {
      const { data: agreements } = await this.axios.get("/agreements");
      const { data: locations } = await this.axios.get("/locations");

      const fields = [
        ...FIELDS,
        {
          type: "select",
          name: "location_id",
          label: "Unité",
          options: locations.map(({ id: value, name }) => ({
            name,
            value
          }))
        },
        {
          type: "tags",
          name: "agreements",
          label: "Conventions",
          tags: agreements.map(({ id, idcc, name }) => ({
            id,
            value: `${idcc} - ${name}`
          })),
          ariaName: "la convention"
        }
      ];

      this.setState({
        fields,
        isLoading: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  render() {
    if (this.state.isLoading) return <AdminMain isLoading />;

    return (
      <AdminForm
        apiPath="/rpc/create_user"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des utilisateurs`,
          createOrEditButton: `Bouton créant un nouvel utilisateur dans la base
                              de données à partir des données du formulaire`
        }}
        defaultData={{ password: generatePassword(PASSWORD_LENGTH) }}
        fields={this.state.fields}
        indexPath="/users"
        isApiFunction
        title="Nouvel utilisateur"
      />
    );
  }
}
