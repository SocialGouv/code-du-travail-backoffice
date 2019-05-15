import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import _Subtitle from "../elements/Subtitle";

const Container = styled(Flex)`
  background-color: var(--color-dark-slate-gray);
  min-width: 12rem;
  width: 12rem;
`;
const Subtitle = styled(_Subtitle)`
  color: white;
  padding: 0 0.5rem;
`;

const Link = styled.div`
  background-color: ${props =>
    Boolean(props.isCurrent) ? "black" : "transparent"};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props =>
    Boolean(props.isCurrent) ? "white" : "rgba(255, 255, 255, 0.75)"};
  cursor: pointer;
  padding: 0.5rem;

  :hover {
    background-color: ${props =>
      Boolean(props.isCurrent) ? "black" : "var(--color-japenese-indigo)"};
    color: white;
  }
`;

export default class AdminMenu extends React.PureComponent {
  goTo(resource) {
    Router.push(`/admin${resource}`);
  }

  isCurrent(path) {
    return path.length !== 0
      ? window.location.pathname.startsWith(`/admin${path}`)
      : window.location.pathname === "/admin";
  }

  render() {
    return (
      <Container flexDirection="column">
        <Link isCurrent={this.isCurrent("")} onClick={() => this.goTo("")}>
          Tableau de bord
        </Link>
        <Link
          isCurrent={this.isCurrent("/agreements")}
          onClick={() => this.goTo("/agreements")}
        >
          Conventions
        </Link>
        <Link
          isCurrent={this.isCurrent("/tags")}
          onClick={() => this.goTo("/tags")}
        >
          Étiquettes
        </Link>
        <Link
          isCurrent={this.isCurrent("/questions")}
          onClick={() => this.goTo("/questions")}
        >
          Questions
        </Link>
        <Link
          isCurrent={this.isCurrent("/answers")}
          onClick={() => this.goTo("/answers")}
        >
          Réponses
        </Link>
        <Link
          isCurrent={this.isCurrent("/locations")}
          onClick={() => this.goTo("/locations")}
        >
          Unités
        </Link>
        <Link
          isCurrent={this.isCurrent("/users")}
          onClick={() => this.goTo("/users")}
        >
          Utilisateurs
        </Link>

        <Subtitle>Maintenance</Subtitle>
        <Link
          isCurrent={this.isCurrent("/migrations")}
          onClick={() => this.goTo("/migrations")}
        >
          Migrations
        </Link>
      </Container>
    );
  }
}
