import styled from "@emotion/styled";
import css from "styled-jsx/css";

import _Subtitle from "../../elements/Subtitle";

export default css`
  .Container {
    background-color: var(--color-dark-slate-gray);
    display: flex;
    flex-direction: column;
    min-width: 13rem;
    overflow-y: auto;
    width: 13rem;
  }
`;

export const Subtitle = styled(_Subtitle)`
  color: white;
  padding: 0 0.5rem;
`;

export const Link = styled.div`
  background-color: ${p => (p.isActive ? "black" : "transparent")};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: ${p => (p.isActive ? "white" : "rgba(255, 255, 255, 0.75)")};
  cursor: pointer;
  padding: 0.5rem;

  :hover {
    background-color: ${p => (p.isActive ? "black" : "var(--color-japenese-indigo)")};
    color: white;
  }
`;
