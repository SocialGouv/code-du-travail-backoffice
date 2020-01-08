import Head from "next/head";
import React from "react";

import Header from "../Header";
import Modal from "../../components/Modal";
import LoadingSpinner from "../../elements/LoadingSpinner";

// TODO Find a clean way to import these stylesheets.
import "quill/dist/quill.snow.css";
import "react-table/react-table.css";
import "react-toastify/dist/ReactToastify.css";

import globalStyles from "./globalStyles";
import styles from "./styles";

export default ({ isHorizontal = false, isLoading = false, ...props }) => (
  <div className="Container">
    <style jsx global>
      {globalStyles}
    </style>
    <style jsx>{styles}</style>
    <Head>
      <title>Outil de contribution au Code du travail numérique</title>
      <link href="/static/icons/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
      <link href="/static/icons/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
      <link href="/static/icons/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
      <link rel="manifest" href="/static/site.webmanifest" />
      <link
        href="https://incubateur.social.gouv.fr/bootstrap/master/@socialgouv/bootstrap.core/dist/socialgouv-bootstrap.min.css"
        rel="stylesheet"
      />
    </Head>
    <Modal />
    <Header />
    {isLoading ? (
      <div className="Content Content--loading" {...props}>
        <LoadingSpinner color="#666666" />
      </div>
    ) : (
      <div className={`Content${!isHorizontal ? " Content--horizontal" : ""}`} {...props} />
    )}
  </div>
);
