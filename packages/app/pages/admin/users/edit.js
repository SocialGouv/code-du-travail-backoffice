import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import AdminUsersNewPage from "./new";

export default class AdminUsersEditPage extends AdminUsersNewPage {
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
      const uri = `/administrator_users?id=eq.${this.props.id}`;

      const { data: users } = await this.axios.get(uri);

      const data = {
        ...users[0],
        agreements: users[0].agreements.map(agreement => ({
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

    const { name } = this.state.data;

    return (
      <AdminForm
        apiPath="/rpc/update_user"
        ariaLabels={{
          cancelButton: `Bouton redirigeant vers la liste des utilisateurs`,
          createOrEditButton: `Bouton mettant à jour l'utilisateur ${name} dans
                              la base de données à partir des données du
                              formulaire`
        }}
        defaultData={this.state.data}
        fields={this.state.fields}
        id={this.props.id}
        indexPath="/users"
        isApiFunction
        title={`Modifier l'utilisateur « ${name} »`}
      />
    );
  }
}
