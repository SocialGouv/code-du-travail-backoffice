import React from "react";

import DataFillerRecordPage from "@socialgouv/cdtn-data-filler/pages/bucket/[bucket]/collection/[collection]/record/[record]";

import AdminMain from "../../../../../../../../src/layouts/AdminMain";

export default class AdminDataFillerRecordPage extends DataFillerRecordPage {
  render() {
    return <AdminMain>{super.render()}</AdminMain>;
  }
}
