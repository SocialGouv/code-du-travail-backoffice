import DataFillerIndexPage from "@socialgouv/code-du-travail-backoffice__data-filler/pages";
import React from "react";

import DataFillerMain from "../../../src/layouts/DataFillerMain";

export default class AdminDataFillerIndexPage extends DataFillerIndexPage {
  render() {
    return <DataFillerMain>{super.render()}</DataFillerMain>;
  }
}
