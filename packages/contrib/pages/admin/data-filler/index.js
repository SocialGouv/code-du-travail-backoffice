import React from "react";

import DataFillerIndexPage from "@socialgouv/cdtn-data-filler/pages";

import AdminMain from "../../../src/layouts/AdminMain";

export default class AdminDataFillerIndexPage extends DataFillerIndexPage {
  render() {
    return <AdminMain>{super.render()}</AdminMain>;
  }
}
