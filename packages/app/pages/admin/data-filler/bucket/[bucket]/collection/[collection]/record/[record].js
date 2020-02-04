import DataFillerRecordPage from "@socialgouv/code-du-travail-backoffice__data-filler/pages/bucket/[bucket]/collection/[collection]/record/[record]";
import React from "react";

import DataFillerMain from "../../../../../../../../src/layouts/DataFillerMain";

export default class AdminDataFillerRecordPage extends DataFillerRecordPage {
  render() {
    return <DataFillerMain>{super.render()}</DataFillerMain>;
  }
}
