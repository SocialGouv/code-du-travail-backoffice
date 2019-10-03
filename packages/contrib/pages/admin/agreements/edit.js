import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMain from "../../../src/layouts/AdminMain";
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
    if (this.state.isLoadingOverwrite) return <AdminMain isLoading />;

    const { name } = this.state.data;

    return (
      <AdminForm
        apiPath="/agreements"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des conventions`,
          createOrEditButton: `Bouton mettant à jour la convention "${name}"
                              dans la base de données à partir des données du
                              formulaire`
        }}
        defaultData={this.state.data}
        fields={this.state.fields}
        id={this.props.id}
        indexPath="/agreements"
        name="agreement"
        title={`Modifier la convention « ${name} »`}
      />
    );
  }
}
