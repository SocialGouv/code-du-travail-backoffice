import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";

const FIELDS = [
  {
    label: "Nom",
    name: "name",
    type: "input",
  },
];

export default class AdminQuestionsEditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  async componentDidMount() {
    const axios = customAxios();

    try {
      const uri = `/administrator_migrations?id=eq.${this.props.id}`;

      const { data: migrations } = await axios.get(uri);

      this.setState({
        data: migrations[0],
        isLoading: false,
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  render() {
    if (this.state.isLoading) return <AdminMainLayout isLoading />;

    return (
      <AdminForm
        apiPath="/administrator_migrations"
        defaultData={this.state.data}
        fields={FIELDS}
        i18nIsFeminine
        i18nSubject="migration"
        id={this.props.id}
        indexPath="/migrations"
        name="migration"
      />
    );
  }
}
