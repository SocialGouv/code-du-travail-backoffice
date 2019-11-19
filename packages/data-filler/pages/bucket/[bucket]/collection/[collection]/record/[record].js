import React from "react";
import Head from "next/head";

import EditRecord from "../../../../../../src/EditRecord";
import Layout from "../../../../../../src/Layout";

import getClient from "../../../../../../src/kinto/client";
import sortByKey from "../../../../../../src/sortByKey";

const RecordPage = props => {
  const { record, records, ...otherProps } = props;
  return (
    <div>
      <Head>
        <title>Dataset: {(record.data && record.data.id) || ""}</title>
      </Head>
      <Layout records={records}>
        <EditRecord record={record} {...otherProps} />
      </Layout>
    </div>
  );
};

RecordPage.getInitialProps = async ({ query }) => {
  const client = getClient();

  const recordsQuery = await client
    .bucket(query.bucket, { headers: {} })
    .collection(query.collection, { headers: {} })
    .listRecords({ limit: 1000 });
  const records = recordsQuery.data.sort(
    sortByKey(r => r.title.trim().toLowerCase())
  );
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
};

export default RecordPage; // () => <div>RecordPage</div>;
