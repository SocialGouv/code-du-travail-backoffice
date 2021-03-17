import styled from "@emotion/styled";
import { Flex } from "rebass";

export const Container = styled(Flex)`
  margin-top: 1rem;
  user-select: none;
`;

export const Top = styled(Flex)`
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  padding-left: 3.25rem;
  text-transform: uppercase;
`;

export const State = styled.span`
  color: var(--color-shadow);
`;

export const UpdatedAt = styled.span`
  color: var(--color-blue-sapphire);
`;

export const Content = styled(Flex)`
  background-color: white;
  border: solid 1px var(--color-border);
  border-radius: 0.4rem;
  cursor: pointer;
  flex-grow: 1;
  padding: 0.75rem 0.5rem 0.75rem 0.75rem;
`;

export const Question = styled.div`
  color: black;
  font-weight: 600;
`;

export const Extract = styled.div`
  color: ${p => (p.isGeneric ? "var(--color-text-red)" : "var(--color-text-gray)")};
  font-size: 0.875rem;
  font-weight: ${p => (p.isGeneric ? "700" : "normal")};
  margin-top: 0.5rem;
`;
