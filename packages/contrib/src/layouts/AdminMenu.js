import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

const Container = styled(Flex)`
  background-color: #315659;
  /* padding: 1rem; */
  width: 12rem;
`;

const Link = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  padding: 0.5rem;

  :hover {
    background-color: rgba(0, 0, 0, 0.1);
    color: white;
  }
`;

export default class AdminMenu extends React.PureComponent {
  goTo(resource) {
    Router.push(`/admin${resource}`);
  }

  render() {
    return (
      <Container flexDirection="column">
        <Link onClick={() => this.goTo("")}>Tableau de bord</Link>
        <Link onClick={() => this.goTo("/agreements")}>Conventions</Link>
        <Link onClick={() => this.goTo("/tags")}>Étiquettes</Link>
        <Link onClick={() => this.goTo("/questions")}>Questions</Link>
        <Link onClick={() => this.goTo("/locations")}>Unités</Link>
        <Link onClick={() => this.goTo("/users")}>Utilisateurs</Link>
      </Container>
    );
  }
}
