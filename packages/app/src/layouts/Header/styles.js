import styled from "@emotion/styled";
import { Flex } from "rebass";
import css from "styled-jsx/css";

export const Brand = styled(Flex)`
  cursor: pointer;
  height: 3rem;

  > svg {
    height: 3rem;
    width: auto;
  }
`;

export default css`
  .Container {
    align-items: center;
    background-color: white;
    border-top: solid 0.3rem black;
    box-shadow: 0 0 0.125rem lightgray;
    display: flex;
    justify-content: space-between;
    min-height: 6rem;
    padding: 1rem;
    position: relative;
    user-select: none;
    z-index: 1;
  }

  .BrandLogo {
    height: 3rem;
    width: auto;
  }

  .BrandText {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
  }

  .BrandTextTitle {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.2;
  }

  .BrandTextSubtitle {
    color: var(--color-mummy-tomb);
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5;
  }

  .User {
    align-items: center;
    display: flex;
  }
`;
