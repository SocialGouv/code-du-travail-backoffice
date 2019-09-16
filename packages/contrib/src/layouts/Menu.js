import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Icon from "../elements/Icon";

import { ANSWER_STATE } from "../constants";
import T from "../texts";

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
  margin: 0.5rem 0.25rem 0.5rem 0;
`;
const DropdownMenu = styled(Flex)`
  left: auto;
  right: 0;
  background-color: white;
  box-shadow: 0 0 0.125rem lightgray;
  display: none;
  margin-top: 0.5rem;
  position: absolute;
  z-index: 1;
`;
const DropdownLink = styled(TopLink)`
  border-bottom: 0;
  margin-left: 0;
  padding: 0.375rem 0.75rem;

  :hover {
    background-color: var(--color-background);
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

  openDoc(path) {
    window.open(`/static/docs/${path}`, "_blank");
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
          <DropdownText>Liste des réponses</DropdownText>
          <DropdownMenu flexDirection="column">
            <DropdownLink onClick={() => this.goToAnswers(ANSWER_STATE.TO_DO)}>
              {T.ANSWERS_INDEX_TITLE(ANSWER_STATE.TO_DO)}
            </DropdownLink>
            <DropdownLink onClick={() => this.goToAnswers(ANSWER_STATE.DRAFT)}>
              {T.ANSWERS_INDEX_TITLE(ANSWER_STATE.DRAFT)}
            </DropdownLink>
            <DropdownLink
              onClick={() => this.goToAnswers(ANSWER_STATE.UNDER_REVIEW)}
            >
              {T.ANSWERS_INDEX_TITLE(ANSWER_STATE.UNDER_REVIEW)}
            </DropdownLink>
            <DropdownLink
              onClick={() => this.goToAnswers(ANSWER_STATE.VALIDATED)}
            >
              {T.ANSWERS_INDEX_TITLE(ANSWER_STATE.VALIDATED)}
            </DropdownLink>
          </DropdownMenu>
          <Icon icon="caret-down" />
        </Dropdown>
        <Dropdown>
          <DropdownText>Aide</DropdownText>
          <DropdownMenu flexDirection="column">
            <DropdownLink
              onClick={() => this.openGuide("/code-du-travail-numerique/")}
            >
              <Icon icon="book" />
              Guide : Outil de contribution
            </DropdownLink>

            <DropdownLink onClick={() => Router.push("/charter")}>
              <Icon icon="file-pdf" />
              Charte rédactionnelle
            </DropdownLink>

            <DropdownLink
              onClick={() =>
                this.openDoc(
                  "Proposition-de-reponse-types-CC-metallurgie-locales.docx"
                )
              }
            >
              <Icon icon="file-word" />
              Proposition de réponses-types CC métallurgie locales
            </DropdownLink>

            <DropdownLink
              onClick={() =>
                this.openDoc("Reformulation-des-intitules-de-question.xlsx")
              }
            >
              <Icon icon="file-excel" />
              Reformulation des intitulés de question
            </DropdownLink>

            <DropdownLink
              onClick={() =>
                this.openDoc(
                  "Premiers-retours-sur-la-validation-des-contributions.docx"
                )
              }
            >
              <Icon icon="file-word" />
              Premiers retours sur la validation des contributions
            </DropdownLink>
          </DropdownMenu>
          <Icon icon="caret-down" />
        </Dropdown>
        <Dropdown>
          <DropdownText>{this.props.me.payload.name}</DropdownText>
          <DropdownMenu flexDirection="column">
            <DropdownLink onClick={() => this.logOut()}>
              <Icon icon="sign-out-alt" />
              Se déconnecter
            </DropdownLink>
          </DropdownMenu>
          <Icon icon="caret-down" />
        </Dropdown>
      </Container>
    );
  }
}
