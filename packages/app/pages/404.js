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

export default function NotFound() {
  return (
    <Main>
      <style jsx>{styles}</style>
      <div className="Container">{`Cette page n'existe pas ou plus.`}</div>
    </Main>
  );
}
