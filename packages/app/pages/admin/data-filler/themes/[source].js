import DataFillerSourcePage from "@socialgouv/code-du-travail-backoffice__data-filler/pages/themes/[source]";
import React from "react";

import DataFillerMain from "../../../../src/layouts/DataFillerMain";

export default class AdminDataFillerSourcePage extends DataFillerSourcePage {
  render() {
    return <DataFillerMain>{super.render()}</DataFillerMain>;
  }
}
