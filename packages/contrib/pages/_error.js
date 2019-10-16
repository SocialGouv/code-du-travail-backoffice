import React from "react";
import css from "styled-jsx/css";

import Main from "../src/layouts/Main";

const styles = css`
  .Container {
    align-items: center;
    display: flex;
    flex-grow: 1;
    justify-content: center;
  }
`;

function Error({ statusCode }) {
  let message;
  switch (true) {
    case statusCode >= 500:
      message = "Une erreur serveur s'est produite.";
      break;

    case statusCode === 404:
      message = "Cette page n'existe pas ou plus.";
      break;

    default:
      message = "Une erreur inattendue s'est produite.";
      break;
  }

  return (
    <Main>
      <style jsx>{styles}</style>
      <div className="Container">{message}</div>
    </Main>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return { statusCode };
};

export default Error;
