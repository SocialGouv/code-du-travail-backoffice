import PropTypes from "prop-types";
import React from "react";

import AdminForm from "../components/AdminForm";
import AdminMainLayout from "../layouts/AdminMain";
import customPostgrester from "../libs/customPostgrester";

export default function withAdminNew(adminFormProps, componentDidMount) {
  class AdminNew extends React.Component {
    constructor(props) {
      super(props);

      this.api = customPostgrester();

      this.state = {
        defaultData: {},
        fields: [],
        isLoading: componentDidMount !== undefined,
      };
    }

    async componentDidMount() {
      if (componentDidMount === undefined) return;

      const { defaultData = {}, fields = [] } = await componentDidMount(this.api);

      this.setState({
        defaultData,
        fields,
        isLoading: false,
      });
    }

    render() {
      const { id } = this.props;
      const { defaultData, fields, isLoading } = this.state;

      if (isLoading) return <AdminMainLayout isLoading />;

      return <AdminForm defaultData={defaultData} fields={fields} id={id} {...adminFormProps} />;
    }
  }

  AdminNew.propTypes = {
    id: PropTypes.string,
  };

  return AdminNew;
}
