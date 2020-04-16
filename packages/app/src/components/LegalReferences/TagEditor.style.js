import styled from "@emotion/styled";
import ReactContentEditable from "react-contenteditable";
import { Flex } from "rebass";

export const Container = styled(Flex)`
  flex-direction: column;
  flex-grow: 1;
`;

export const ValueEditor = styled(ReactContentEditable)`
  background-color: white;
  padding: 0.2rem 0.4rem;
`;
export const UrlEditor = styled(ValueEditor)`
  border-top: solid 1px var(--color-border);
`;
