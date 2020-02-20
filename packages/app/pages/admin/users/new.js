import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";
import generatePassword from "../../../src/libs/generatePassword";

const PASSWORD_LENGTH = 16;

const FIELDS = [
  {
    label: "Nom",
    name: "name",
    type: "input"
  },
  {
    label: "Rôle",
    name: "role",
    options: [
      { label: "Administrateur", value: "administrator" },
      { label: "Administrateur régional", value: "regional_administrator" },
      { label: "Contributeur", value: "contributor" }
    ],
    type: "select"
  },
  {
    inputType: "email",
    label: "E-mail",
    name: "email",
    type: "input"
  },
  {
    button: {
      ariaLabel: "Bouton générant un mot de passe aléatoire",
      handler: () => generatePassword(PASSWORD_LENGTH),
      icon: "sync"
    },
    label: "Mot-de-passe",
    name: "password",
    type: "input"
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
          label: "Unité",
          name: "location_id",
          options: locations.map(({ id: value, name: label }) => ({
            label,
            value
          })),
          type: "select"
        },
        {
          ariaName: "la convention",
          label: "Conventions",
          name: "agreements",
          tags: agreements.map(({ id, idcc, name }) => ({
            id,
            value: `${idcc} - ${name}`
          })),
          type: "tags"
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
    if (this.state.isLoading) return <AdminMainLayout isLoading />;

    return (
      <AdminForm
        apiPath="/rpc/create_user"
        defaultData={{ password: generatePassword(PASSWORD_LENGTH) }}
        fields={this.state.fields}
        i18nSubject="utilisateur"
        indexPath="/users"
        isApiFunction
      />
    );
  }
}
