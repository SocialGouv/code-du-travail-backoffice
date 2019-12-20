import React from "react";
import Head from "next/head";

import EditRecord from "../../../../../../src/EditRecord";
import Layout from "../../../../../../src/Layout";

import getClient from "../../../../../../src/kinto/client";
import sortByKey from "../../../../../../src/sortByKey";

export default class RecordPage extends React.Component {
  static async getInitialProps({ query }) {
    const client = getClient();

    const recordsQuery = await client
      .bucket(query.bucket, { headers: {} })
      .collection(query.collection, { headers: {} })
      .listRecords({ limit: 1000 });
    const records = recordsQuery.data.sort(sortByKey(r => r.title.trim().toLowerCase()));

    let record;
    if (records.length === 0 || query.record === "new") {
      record = await client
        .bucket(query.bucket, { headers: {} })
        .collection(query.collection, { headers: {} })
        .createRecord({ title: "nouveau..." });
    } else {
      if (query.record) {
        record = await client
          .bucket(query.bucket, { headers: {} })
          .collection(query.collection, { headers: {} })
          .getRecord(query.record, { headers: {} });
      } else {
        record = records[-1];
      }
    }

    return {
      record,
      records,
      query
    };
  }

  render() {
    const { record, query, records, ...props } = this.props;

    return (
      <div>
        <Head>
          <title>Dataset: {(record.data && record.data.id) || ""}</title>
        </Head>
        <Layout query={query} records={records}>
          <EditRecord query={query} record={record} {...props} />
          <br />
          <br />
          <br />
        </Layout>
      </div>
    );
  }
}
