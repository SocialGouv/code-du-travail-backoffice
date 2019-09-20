import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Login from "../src/components/Login";
import Main from "../src/layouts/Main";
import isAuthenticated from "../src/libs/isAuthenticated";
import getCurrentUser from "../src/libs/getCurrentUser";

import { USER_ROLE } from "../src/constants";

const Left = styled(Flex)`
  padding: 5rem;
`;
const Right = styled(Flex)`
  padding: 1rem;
`;

const LeftImage = styled.img`
  width: 50%;
`;
const LeftTitle = styled.p`
  font-size: 2rem;
  font-weight: 600;
  margin-top: 2.5rem;
`;

const RightContainer = styled(Flex)`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  max-width: 36rem;
  width: 100%;
`;
const RightTitle = styled.p`
  font-size: 1.2rem;
`;
const HelpText = styled.p`
  font-size: 0.8rem;
  margin: 1rem 0 0;
  opacity: 0.5;
`;

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.forceUpdate = this.forceUpdate.bind(this);
  }

  static getInitialProps({ query: { redirectTo } }) {
    return { redirectTo };
  }

  async componentDidUpdate() {
    try {
      if (await isAuthenticated()) {
        const { role } = getCurrentUser();

        switch (true) {
          case [
            USER_ROLE.ADMINISTRATOR,
            USER_ROLE.REGIONAL_ADMINISTRATOR
          ].includes(role):
            Router.push("/admin");
            break;

          case role === USER_ROLE.CONTRIBUTOR:
            Router.push("/");
            break;
        }
      }
    } catch (error) {
      console.warn(error);
    }
  }

  render() {
    return (
      <Main isHorizontal>
        <Left flexDirection="column" justifyContent="center" width={1 / 2}>
          <LeftImage src="/static/images/welcome.svg" alt="" />
          <LeftTitle>
            Bienvenue sur l’outil de contribution au Code du travail numérique
          </LeftTitle>
          <p>
            Un outil simple pour composer et éditer vos contributions au Code du
            travail numérique.
          </p>
        </Left>
        <Right alignItems="center" justifyContent="center" width={1 / 2}>
          <RightContainer flexDirection="column">
            <RightTitle>
              Identifiez-vous pour accéder à votre compte:
            </RightTitle>
            <Login onLog={this.forceUpdate} />
            <HelpText>
              <a href="mailto:codedutravail@beta.gouv.fr">
                Une question? Un problème pour vous connecter?
              </a>
            </HelpText>
          </RightContainer>
        </Right>
      </Main>
    );
  }
}
