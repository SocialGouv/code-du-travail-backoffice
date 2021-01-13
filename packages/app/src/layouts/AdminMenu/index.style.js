import styled from "@emotion/styled";

import _Subtitle from "../../elements/Subtitle";

export const Container = styled.div`
  background-color: var(--color-dark-slate-gray);
  display: flex;
  flex-direction: column;
  min-width: 13rem;
  overflow-y: auto;
  width: 13rem;
`;

export const Subtitle = styled(_Subtitle)`
  color: white;
  padding: 0 0.5rem;
`;

export const Link = styled.button`
  appearance: none;
  background-color: ${p => (p.isActive ? "black" : "transparent")};
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: ${p => (p.isActive ? "white" : "rgba(255, 255, 255, 0.75)")};
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  padding: 0.5rem;
  text-align: left;

  :hover {
    background-color: ${p => (p.isActive ? "black" : "var(--color-japenese-indigo)")};
    color: white;
  }
`;
