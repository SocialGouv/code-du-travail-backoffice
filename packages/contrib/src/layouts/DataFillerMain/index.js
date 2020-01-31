import Head from "next/head";
import React from "react";

import AdminMain from "../AdminMain";

const DataFillerMain = ({ children }) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://incubateur.social.gouv.fr/bootstrap/master/@socialgouv/bootstrap.core/dist/socialgouv-bootstrap.min.css"
          integrity="grB93+Lj8+H7BK2kCBM0dGAJD+8tE7pYqy6qkcykr8DfCJt7PhJOF998Bwj7BAWc"
          crossOrigin="anonymous"
        />
      </Head>
      <AdminMain>{children}</AdminMain>
    </>
  );
};

export default DataFillerMain;
