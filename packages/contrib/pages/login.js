import Router from "next/router";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Login from "../src/components/Login";
import Main from "../src/layouts/Main";
import isAuthenticated from "../src/lib/isAuthenticated";

import welcomeImgUri from "../src/images/welcome.svg";

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

  async componentDidUpdate() {
    try {
      if (await isAuthenticated()) Router.push("/");
    } catch (error) {
      console.warn(error);
    }
  }

  editAnswer(answerId) {
    Router.push(`/answer/${answerId}`);
  }

  render() {
    return (
      <Main isHorizontal>
        <Left flexDirection="column" justifyContent="center" width={1 / 2}>
          <LeftImage src={welcomeImgUri} alt="" />
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
            <Login onLog={() => this.forceUpdate()} />
            <HelpText>
              <a href="mailto:contact@code-du-travail.beta.gouv.fr">
                Une question? Un problème pour vous connecter?
              </a>
            </HelpText>
          </RightContainer>
        </Right>
      </Main>
    );
  }
}
