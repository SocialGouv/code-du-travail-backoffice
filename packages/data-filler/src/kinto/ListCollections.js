import React from "react";

import KintoFetch from "./KintoFetch";

const ListCollections = ({ bucket, render }) => (
  <KintoFetch
    fetch={({ client }) =>
      client.bucket(bucket, { headers: {} }).listCollections({ headers: {} })
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

export default ListCollections;
