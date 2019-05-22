import React from "react";

import AdminForm from "../../../src/components/AdminForm";
import AdminMain from "../../../src/layouts/AdminMain";
import AdminAgreementsNewPage from "./new";

import { ZONE_CATEGORY_LABEL } from "../../../src/constants";

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
      const agreementsUri = `/agreements?id=eq.${this.props.id}`;

      const zonesSelect = `select=zone(category,code,id,name)`;
      const zonesWhere = `agreement_id=eq.${this.props.id}`;
      const zonesUri = `/agreements_zones?${zonesSelect}&${zonesWhere}`;

      const { data: agreements } = await this.axios.get(agreementsUri);
      const { data: agreementsZones } = await this.axios.get(zonesUri);

      this.setState({
        data: {
          ...agreements[0],
          zones: agreementsZones.map(({ zone }) => ({
            id: zone.id,
            value: `${zone.name} [${ZONE_CATEGORY_LABEL[zone.category]} - ${
              zone.code
            }]`
          }))
        },
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
