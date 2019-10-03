import Head from "next/head";
import React from "react";

import Header from "../Header";
import Modal from "../../components/Modal";
import LoadingSpinner from "../../elements/LoadingSpinner";

// TODO Find a clean way to import these stylesheets.
import "quill/dist/quill.snow.css";
import "react-table/react-table.css";
import "react-toastify/dist/ReactToastify.css";
import "simplemde/dist/simplemde.min.css";

import globalStyles from "./globalStyles";
import styles from "./styles";

export default ({ isHorizontal = false, isLoading = false, ...props }) => (
  <div className="Container">
    <style jsx global>
      {globalStyles}
    </style>
    <style jsx>{styles}</style>
    <Head>
      <title>Outil de contribution au code du travail numérique</title>
    </Head>
    <Modal />
    <Header />
    {isLoading ? (
      <div className="Content Content--loading" {...props}>
        <LoadingSpinner color="#666666" />
      </div>
    ) : (
      <div
        className={`Content${!isHorizontal ? " Content--horizontal" : ""}`}
        {...props}
      />
    )}
  </div>
);
