import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMain from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";
import AdminAgreementsNewPage from "./new";

export default class AdminAgreementsEditPage extends AdminAgreementsNewPage {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      data: {},
      isLoading: true
    };
  }

  static getInitialProps({ query: { id } }) {
    return { id };
  }

  async componentDidMount() {
    const axios = customAxios();

    try {
      const uri = `/agreements?id=eq.${this.props.id}`;

      const { data: agreements } = await axios.get(uri);

      this.setState({
        data: agreements[0],
        isLoading: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  render() {
    if (this.state.isLoading) return <AdminMain isLoading />;

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
        title={`Modifier la convention « ${name} »`}
      />
    );
  }
}
