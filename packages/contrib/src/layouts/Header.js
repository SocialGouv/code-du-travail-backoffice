import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Menu from "./Menu";

import marianneImageUri from "../images/marianne.svg";

const Container = styled(Flex)`
  background-color: white;
  border-top: solid 0.3rem black;
  box-shadow: 0 0 0.125rem lightgray;
  min-height: 6rem;
  padding: 1rem;
  position: relative;
  user-select: none;
  z-index: 1;
`;

const Brand = styled(Flex)`
  cursor: pointer;
  height: 3rem;
`;
const Logo = styled.img`
  height: 3rem;
  margin-right: 1rem;
`;
const Title = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
`;
const Subtitle = styled.span`
  color: #999999;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
`;

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      me: null
    };
  }

  componentDidMount() {
    this.setState({ me: JSON.parse(sessionStorage.getItem("me")) });
  }

  goToHome() {
    Router.push(this.props.isAdmin ? "/admin" : "/");
  }

  render() {
    return (
      <Container alignItems="center" justifyContent="space-between">
        <Brand alignItems="center" onClick={() => this.goToHome()}>
          <Logo
            alt="Code du travail numérique"
            aria-label="Bouton de retour au tableau de bord"
            src={marianneImageUri}
          />
          <Flex flexDirection="column">
            <Title>Code du travail numérique</Title>
            <Subtitle>Outil de contribution</Subtitle>
          </Flex>
        </Brand>
        {this.state.me !== null && (
          <Flex alignItems="center">
            {this.props.hasContribMenu && (
              <Menu
                isAdmin={this.props.isAdmin}
                me={this.state.me}
                router={this.props.router}
              />
            )}
            {/* <UserInfo alignItems="flex-end" flexDirection="column">
              <UserName>{this.state.me.payload.name}</UserName>
              <UserLocation>{this.state.me.payload.location}</UserLocation>
            </UserInfo>
            <UserLogoutIcon
              alt="Bouton de déconnexion"
              onClick={this.logOut}
              src={logoutImageUri}
            /> */}
          </Flex>
        )}
      </Container>
    );
  }
}
