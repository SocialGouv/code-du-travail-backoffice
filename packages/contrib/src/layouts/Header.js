import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import marianneImageUri from "../images/marianne.svg";
import logoutImageUri from "../images/logout.svg";

const Container = styled(Flex)`
  background-color: white;
  border-top: solid 0.3rem black;
  min-height: 6rem;
  padding: 1rem;
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

const UserInfo = styled(Flex)`
  margin-right: 1rem;
`;
const UserName = styled.span`
  font-weight: 600;
  width: auto;
`;
const UserLocation = styled.span`
  color: lightgray;
  width: auto;
`;
const UserLogoutIcon = styled.img`
  cursor: pointer;
  height: 1rem;
  width: 1rem;
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
    const homePath = window.location.pathname.startsWith("/admin")
      ? "/admin"
      : "/";

    Router.push(homePath);
  }

  logOut() {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("me");
    window.location.reload();
  }

  render() {
    return (
      <Container alignItems="center" justifyContent="space-between">
        <Brand alignItems="center" onClick={this.goToHome}>
          <Logo src={marianneImageUri} alt="Code du travail numérique" />
          <Flex flexDirection="column">
            <Title>Code du travail numérique</Title>
            <Subtitle>Outil de contribution</Subtitle>
          </Flex>
        </Brand>
        {this.state.me !== null && (
          <Flex alignItems="center">
            <UserInfo alignItems="flex-end" flexDirection="column">
              <UserName>{this.state.me.payload.name}</UserName>
              <UserLocation>{this.state.me.payload.location}</UserLocation>
            </UserInfo>
            <UserLogoutIcon onClick={this.logOut} src={logoutImageUri} />
          </Flex>
        )}
      </Container>
    );
  }
}
