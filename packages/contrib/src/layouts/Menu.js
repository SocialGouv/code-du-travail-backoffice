import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

const Container = styled(Flex)`
  background-color: var(--color-dark-slate-gray);
  min-height: 2rem;
  padding: 0 1rem;
`;

const Link = styled.div`
  background-color: ${props =>
    Boolean(props.isCurrent) ? "black" : "transparent"};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props =>
    Boolean(props.isCurrent) ? "white" : "rgba(255, 255, 255, 0.75)"};
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  white-space: nowrap;

  :hover {
    background-color: ${props =>
      Boolean(props.isCurrent) ? "black" : "var(--color-japenese-indigo)"};
    color: white;
  }
`;

export default class Menu extends React.PureComponent {
  isCurrent(path) {
    return path.length > 1
      ? window.location.pathname.startsWith(path)
      : window.location.pathname === path;
  }

  render() {
    return (
      <Container>
        <Link isCurrent={this.isCurrent("/")} onClick={() => Router.push("/")}>
          Liste des réponses
        </Link>
        <Link
          isCurrent={this.isCurrent("/chart")}
          onClick={() => Router.push("/chart")}
        >
          Charte rédactionnelle
        </Link>
      </Container>
    );
  }
}
