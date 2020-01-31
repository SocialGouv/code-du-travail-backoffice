import DataFillerRecordPage from "@socialgouv/cdtn-data-filler/pages/bucket/[bucket]/collection/[collection]/record/[record]";
import React from "react";

import DataFillerMain from "../../../../../../../../src/layouts/DataFillerMain";

export default class AdminDataFillerRecordPage extends DataFillerRecordPage {
  render() {
    return <DataFillerMain>{super.render()}</DataFillerMain>;
  }
}
