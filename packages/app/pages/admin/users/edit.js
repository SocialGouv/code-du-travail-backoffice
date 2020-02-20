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

    return (
      <AdminForm
        apiPath="/rpc/update_user"
        defaultData={this.state.data}
        fields={this.state.fields}
        i18nSubject="utilisateur"
        id={this.props.id}
        indexPath="/users"
        isApiFunction
      />
    );
  }
}
