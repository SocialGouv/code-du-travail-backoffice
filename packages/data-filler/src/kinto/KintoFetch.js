import React from "react";

import withKinto from "./withKinto";
import AsyncFetch from "../lib/AsyncFetch";

const KintoFetch = withKinto(({ client, fetch, render }) => (
  <AsyncFetch
    fetch={() => fetch({ client })}
    autoFetch={true}
    render={render}
  />
));

export default KintoFetch;
