import styled from "@emotion/styled";
import { Flex } from "rebass";

import Button from "../../elements/Button";

export const Container = styled(Flex)`
  font-size: 1.25rem;
  margin-top: 1rem;
  min-height: 2rem;
  user-select: none;
`;

export const NextButton = styled(Button)`
  font-size: 1.25rem;

  > svg {
    margin: 0.325rem 0.9rem 0.325rem 1.1rem;
  }
`;
export const PreviousButton = styled(NextButton)`
  > svg {
    margin: 0.325rem 1.1rem 0.325rem 0.9rem;
  }
`;

export const PageButton = styled(Button)`
  font-size: 0.875rem;
  margin: 0 0.5rem;
`;
