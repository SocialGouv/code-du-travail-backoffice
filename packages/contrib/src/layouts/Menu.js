import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Icon from "../elements/Icon";

import { ANSWER_STATE } from "../constants";

const Container = styled(Flex)`
  padding-top: 0.3rem;
`;

const BaseLink = styled.span`
  border-bottom: 1px solid white;
  color: var(--color-dark-slate-gray);
  cursor: pointer;
  font-size: 0.875rem;
  margin-left: 2.5rem;
  padding: 2px 0;
  white-space: nowrap;
`;

const TopLink = styled(BaseLink)`
  cursor: ${({ isActive }) => (isActive ? "default" : "pointer")};
  font-weight: ${({ isActive }) => (isActive ? 700 : 400)};

  :hover {
    border-bottom: 1px solid
      ${props => (props.isActive ? "white" : "var(--color-dark-slate-gray)")};
  }
`;

const Dropdown = styled.div`
  color: var(--color-dark-slate-gray);
  cursor: pointer;
  font-size: 0.875rem;
  margin-left: 2.5rem;
  padding: 3px 0 0.5rem;
  position: relative;
  white-space: nowrap;

  :hover > div {
    display: flex;
  }
`;
const DropdownText = styled.span`
  margin: 0.5rem 0 0.5rem 0.25rem;
`;
const DropdownMenu = styled(Flex)`
  background-color: white;
  box-shadow: 0 0 0.125rem lightgray;
  display: none;
  margin-top: 0.5rem;
  padding: 0.375rem 0.75rem;
  position: absolute;
  z-index: 1;
`;
const DropdownLink = styled(TopLink)`
  border-bottom: 0;
  margin: 0.125rem;

  :hover {
    border-bottom: 0;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

export default class Menu extends React.PureComponent {
  goToAnswers(state) {
    Router.push(`/answers/${state}/1`);
  }

  openGuide(path) {
    window.open(`https://jean-rene-duscher.gitbook.io${path}`, "_blank");
  }

  logOut() {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("me");

    Router.push("/login");
  }

  render() {
    if (this.props.isAdmin)
      return (
        <Container>
          <Dropdown>
            <Icon icon="caret-down" />
            <DropdownText>{this.props.me.payload.name}</DropdownText>
            <DropdownMenu flexDirection="column">
              <DropdownLink onClick={() => this.logOut()}>
                <Icon icon="sign-out-alt" />
                Se déconnecter
              </DropdownLink>
            </DropdownMenu>
          </Dropdown>
        </Container>
      );

    return (
      <Container>
        <Dropdown>
          <Icon icon="caret-down" />
          <DropdownText>Liste des réponses</DropdownText>
          <DropdownMenu flexDirection="column">
            <DropdownLink onClick={() => this.goToAnswers(ANSWER_STATE.TO_DO)}>
              Réponses à rédiger
            </DropdownLink>
            <DropdownLink onClick={() => this.goToAnswers(ANSWER_STATE.DRAFT)}>
              Réponses en cours de rédaction
            </DropdownLink>
            <DropdownLink
              onClick={() => this.goToAnswers(ANSWER_STATE.PENDING_REVIEW)}
            >
              Réponses en cours de validation
            </DropdownLink>
            <DropdownLink
              onClick={() => this.goToAnswers(ANSWER_STATE.VALIDATED)}
            >
              Réponses validées
            </DropdownLink>
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <Icon icon="caret-down" />
          <DropdownText>Aide</DropdownText>
          <DropdownMenu flexDirection="column">
            <DropdownLink
              onClick={() => this.openGuide("/code-du-travail-numerique/")}
            >
              <Icon icon="book" />
              Guide : Outil de contribution
            </DropdownLink>
            <DropdownLink onClick={() => Router.push("/chart")}>
              <Icon icon="feather-alt" />
              Charte rédactionnelle
            </DropdownLink>
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <Icon icon="caret-down" />
          <DropdownText>{this.props.me.payload.name}</DropdownText>
          <DropdownMenu flexDirection="column">
            <DropdownLink onClick={() => this.logOut()}>
              <Icon icon="sign-out-alt" />
              Se déconnecter
            </DropdownLink>
          </DropdownMenu>
        </Dropdown>
      </Container>
    );
  }
}
