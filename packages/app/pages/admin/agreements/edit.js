import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import AdminAgreementsNewPage from "./new";

export default class AdminAgreementsEditPage extends AdminAgreementsNewPage {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      data: {},
      isLoadingOverwrite: true
    };
  }

  static getInitialProps({ query: { id } }) {
    return { id };
  }

  async componentDidMount() {
    await super.componentDidMount();

    try {
      const uri = `/agreements?id=eq.${this.props.id}`;
      const { data: agreements } = await this.axios.get(uri);

      this.setState({
        data: agreements[0],
        isLoadingOverwrite: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  render() {
    if (this.state.isLoadingOverwrite) return <AdminMainLayout isLoading />;

    return (
      <AdminForm
        apiPath="/agreements"
        defaultData={this.state.data}
        fields={this.state.fields}
        i18nIsFeminine
        i18nSubject="convention"
        id={this.props.id}
        indexPath="/agreements"
        name="agreement"
      />
    );
  }
}
