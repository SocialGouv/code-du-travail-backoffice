// import Router from "next/router";
import styled from "@emotion/styled";
import { Flex } from "rebass";

import _Subtitle from "../../elements/Subtitle";
import _Title from "../../elements/Title";

export const Left = styled(Flex)`
  padding: 5rem;

  > svg {
    height: auto;
    width: 80%;
  }
`;

export const Right = styled(Flex)`
  background-color: white;
  padding: 5rem;
`;

export const Title = styled(_Title)`
  font-size: 2rem;
  line-height: 1.25;
  margin: 2rem 0 1.5rem;
`;

export const Subtitle = styled(_Subtitle)`
  margin-bottom: 2rem;
`;

export const HelpText = styled.p`
  font-size: 0.8rem;
  margin: 1rem 0 0;
  opacity: 0.5;
`;
