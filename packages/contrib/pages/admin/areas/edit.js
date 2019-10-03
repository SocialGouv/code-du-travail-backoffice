import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMain from "../../../src/layouts/AdminMain";

import AdminAreasNewPage from "./new";

export default class AdminAreasEditPage extends AdminAreasNewPage {
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
      const uri = `/areas?id=eq.${this.props.id}`;

      const { data: areas } = await this.axios.get(uri);

      const data = areas[0];

      this.setState({
        data,
        isLoadingOverwrite: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  render() {
    if (this.state.isLoadingOverwrite) return <AdminMain isLoading />;

    const { name } = this.state.data;

    return (
      <AdminForm
        apiPath="/areas"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des zones`,
          createOrEditButton: `Bouton mettant à jour la zone "${name}" dans
                              la base de données à partir des données du
                              formulaire`
        }}
        defaultData={this.state.data}
        fields={this.state.fields}
        id={this.props.id}
        indexPath="/areas"
        name="area"
        title={`Modifier la zone « ${this.state.data.name} »`}
      />
    );
  }
}
