// import Router from "next/router";
import React from "react";
import { Flex, Text } from "rebass/styled-components";

import Form from "./Form";
import Main from "../../layouts/Main";

import { HelpText, Left, Right, Subtitle, Title } from "./styles";

import Welcome from "./welcome.svg";

export default ({ onLoggedIn }) => (
  <Main isHorizontal>
    <Left flexDirection="column" justifyContent="center" width={0.5}>
      <Welcome />
      <Title>Bienvenue sur l’outil de contribution au Code du travail numérique</Title>
      <Text>
        {`Un outil simple pour composer et éditer vos contributions au `}
        <a
          href="https://codedutravail.num.social.gouv.fr/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Code du travail numérique
        </a>
        .
      </Text>
    </Left>
    <Right alignItems="center" justifyContent="center" width={0.5}>
      <Flex flexDirection="column">
        <Subtitle>Identifiez-vous pour accéder à votre compte :</Subtitle>
        <Form onLoggedIn={onLoggedIn} />
        <HelpText>
          <a href="mailto:codedutravail@beta.gouv.fr">
            Une question? Un problème pour vous connecter?
          </a>
        </HelpText>
      </Flex>
    </Right>
  </Main>
);
