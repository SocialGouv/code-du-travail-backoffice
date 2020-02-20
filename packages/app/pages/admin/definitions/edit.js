import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import customPostgrester from "../../../src/libs/customPostgrester";
import AdminDefinitionsNewPage from "./new";

export default class AdminDefinitionsEditPage extends AdminDefinitionsNewPage {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      isLoading: true
    };
  }

  static getInitialProps({ query: { id } }) {
    return { id };
  }

  async componentDidMount() {
    const { id } = this.props;

    const { data: definitions } = await customPostgrester()
      .eq("id", id)
      .get("/definitions");

    this.setState({
      data: definitions[0],
      isLoading: false
    });
  }

  render() {
    const { id } = this.props;
    const { data, isLoading } = this.state;

    if (isLoading) return <AdminMainLayout isLoading />;

    return (
      <AdminForm
        apiPath="/definitions"
        defaultData={data}
        fields={this.fields}
        i18nIsFeminine
        i18nSubject="définition"
        id={id}
        indexPath="/definitions"
      />
    );
  }
}
