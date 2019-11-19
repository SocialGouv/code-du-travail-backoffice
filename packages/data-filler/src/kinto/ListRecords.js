import React from "react";

import KintoFetch from "./KintoFetch";

import memoizee from "memoizee";

// cache by bucket + collection
// todo: update when some item change
const cache = {};

const fetchRecords = (client, bucket, collection, sort) =>
  client
    .bucket(bucket, { headers: {} })
    .collection(collection, { headers: {} })
    .listRecords({ sort, headers: {} });

const memoizedFetchRecords = memoizee(fetchRecords, {
  promise: true,
  normalizer: function(args) {
    return args[1] + args[2];
  }
});

//  🌈 double render prop
// render prop that render with `result` from `collection.listRecords`
const ListRecords = ({ bucket, collection, render, sort = "title" }) => (
  <KintoFetch
    fetch={({ client }) =>
      memoizedFetchRecords(client, bucket, collection, sort)
    }
    render={({ status, result }) => (
      <React.Fragment>
        {status === "error" && (
          <div>error fetching bucket {bucket} collections</div>
        )}
        {status === "success" &&
          render({
            result
          })}
      </React.Fragment>
    )}
  />
);

export default ListRecords;
