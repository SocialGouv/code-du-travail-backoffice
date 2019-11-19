import React from "react";
import KintoContext from "./KintoContext";

const withKinto = Component => props => (
  <KintoContext.Consumer>
    {({ client }) => <Component {...props} client={client} />}
  </KintoContext.Consumer>
);

export default withKinto;
