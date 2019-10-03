/* eslint-disable max-len */

import css from "styled-jsx/css";

export default css`
  .Container {
    align-items: stretch;
    display: flex;
    height: 100vh;
    flex-direction: column;
    flex-grow: 1;
  }

  .Content {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
  }
  .Content--vertical {
    flex-direction: column;
  }
  .Content--loading {
    align-items: center;
    justify-content: center;
  }
`;
