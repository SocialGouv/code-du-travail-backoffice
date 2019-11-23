import React from "react";

import DataFillerSourcePage from "@socialgouv/cdtn-data-filler/pages/themes/[source]";

import AdminMain from "../../../../src/layouts/AdminMain";

export default class AdminDataFillerSourcePage extends DataFillerSourcePage {
  render() {
    return <AdminMain>{super.render()}</AdminMain>;
  }
}
