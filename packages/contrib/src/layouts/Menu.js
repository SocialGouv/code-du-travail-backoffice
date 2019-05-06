import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Icon from "../elements/Icon";

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
  logOut() {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("me");

    Router.push("/login");
  }

  isActive(path) {
    return path.length > 1
      ? this.props.router.pathname.startsWith(path)
      : this.props.router.pathname === path;
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
        <TopLink isActive={this.isActive("/")} onClick={() => Router.push("/")}>
          Liste des réponses
        </TopLink>
        <Dropdown>
          <Icon icon="caret-down" />
          <DropdownText>Aide</DropdownText>
          <DropdownMenu flexDirection="column">
            <DropdownLink
              isActive={this.isActive("/chart")}
              onClick={() => Router.push("/chart")}
            >
              <Icon icon="tasks" />
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
