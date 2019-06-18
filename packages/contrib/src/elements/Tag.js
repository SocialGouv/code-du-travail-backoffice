import styled from "styled-components";

export default styled.span`
  background-color: ${props =>
    props.selected ? "var(--color-lapis-lazuli)" : "transparent"};
  border-radius: 0.8rem;
  border: solid 1px var(--color-lapis-lazuli);
  color: ${props => (props.selected ? "white" : "var(--color-lapis-lazuli)")};
  cursor: pointer;
  font-size: 0.8rem;
  margin: 0 0.5rem 0.5rem 0;
  opacity: ${({ isDisabled }) => (Boolean(isDisabled) ? 0.25 : 1)};
  padding: 0.25rem 0.75rem;
  user-select: none;
  white-space: nowrap;
`;
