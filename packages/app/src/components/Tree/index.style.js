import styled from "@emotion/styled";

export const List = styled.ul`
  flex-grow: 1;
  line-height: 1.5;
  list-style: none;
  margin: 0 0 1rem;
  padding: 0 1rem 0 0;
  user-select: none;
`;

export const Item = styled.li`
  cursor: pointer;
  margin-left: ${p => p.depth}rem;

  > svg {
    margin-right: 0.5rem;
  }
`;

export const Container = styled(List)`
  height: 0;
  overflow-y: auto;
`;
