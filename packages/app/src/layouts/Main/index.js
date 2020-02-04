// TODO Find a clean way to import these stylesheets.
import "quill/dist/quill.snow.css";
import "react-table/react-table.css";
import "react-toastify/dist/ReactToastify.css";

import Head from "next/head";
import React from "react";

import Modal from "../../components/Modal";
import LoadingSpinner from "../../elements/LoadingSpinner";
import Header from "../Header";
import globalStyles from "./globalStyles";
import styles from "./styles";

const MainLayout = ({ isHorizontal = false, isLoading = false, ...props }) => (
  <div className="Container">
    <Head>
      <title>Outil de contribution au Code du travail numérique</title>
    </Head>
    <style jsx global>
      {globalStyles}
    </style>
    <style jsx>{styles}</style>
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

export default MainLayout;
