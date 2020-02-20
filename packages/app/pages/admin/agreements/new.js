import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";

const FIELDS = [
  {
    label: "Nom",
    name: "name",
    type: "input"
  },
  {
    label: "IDCC",
    name: "idcc",
    type: "input"
  }
];

export default class AdminAgreementsNewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: FIELDS,
      isLoading: true
    };
  }

  async componentDidMount() {
    this.axios = customAxios();

    try {
      const { data: agreements } = await this.axios.get("/agreements");

      const fields = [
        ...FIELDS,
        {
          label: "Convention parente",
          name: "parent_id",
          options: agreements.map(({ id, idcc, name }) => ({
            label: `${idcc} - ${name}`,
            value: id
          })),
          type: "select"
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
        apiPath="/agreements"
        fields={this.state.fields}
        i18nIsFeminine
        i18nSubject="convention"
        indexPath="/agreements"
        name="agreement"
      />
    );
  }
}
