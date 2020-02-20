import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import AdminLocationsNewPage from "./new";

export default class AdminLocationsEditPage extends AdminLocationsNewPage {
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
      const uri = `/locations?select=*,agreements(*)&id=eq.${this.props.id}`;
      const { data: locations } = await this.axios.get(uri);

      const data = {
        ...locations[0],
        agreements: locations[0].agreements.map(agreement => ({
          id: agreement.id,
          value: `${agreement.idcc} - ${agreement.name}`
        }))
      };

      this.setState({
        data,
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
        apiPath="/locations"
        defaultData={this.state.data}
        fields={this.state.fields}
        i18nIsFeminine
        i18nSubject="unité"
        id={this.props.id}
        indexPath="/locations"
        name="location"
      />
    );
  }
}
