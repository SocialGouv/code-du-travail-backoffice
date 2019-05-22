import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMain from "../../../src/layouts/AdminMain";

import AdminZonesNewPage from "./new";

export default class AdminZonesEditPage extends AdminZonesNewPage {
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
      const uri = `/zones?id=eq.${this.props.id}`;

      const { data: zones } = await this.axios.get(uri);

      const data = zones[0];

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
        apiPath="/zones"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des zones`,
          createOrEditButton: `Bouton mettant à jour la zone "${name}" dans
                              la base de données à partir des données du
                              formulaire`
        }}
        defaultData={this.state.data}
        fields={this.state.fields}
        id={this.props.id}
        indexPath="/zones"
        name="zone"
        title={`Modifier la zone « ${this.state.data.name} »`}
      />
    );
  }
}
