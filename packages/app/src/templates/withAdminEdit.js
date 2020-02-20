import PropTypes from "prop-types";
import React from "react";

import AdminForm from "../components/AdminForm";
import AdminMainLayout from "../layouts/AdminMain";
import customPostgrester from "../libs/customPostgrester";

export default function withAdminEdit(adminFormProps, componentDidMount) {
  class AdminEdit extends React.Component {
    constructor(props) {
      super(props);

      this.api = customPostgrester();

      this.state = {
        data: {},
        fields: [],
        isLoading: true,
      };
    }

    async componentDidMount() {
      const { id } = this.props;

      const { defaultData = {}, fields = [] } = await componentDidMount(this.api, id);

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

  AdminEdit.propTypes = {
    id: PropTypes.string,
  };

  return AdminEdit;
}
