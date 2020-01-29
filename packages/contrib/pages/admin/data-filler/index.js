import React from "react";

import DataFillerIndexPage from "@socialgouv/cdtn-data-filler/pages";

import DataFillerMain from "../../../src/layouts/DataFillerMain";

export default class AdminDataFillerIndexPage extends DataFillerIndexPage {
  render() {
    return <DataFillerMain>{super.render()}</DataFillerMain>;
  }
}
