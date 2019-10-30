import styled from "@emotion/styled";

export default styled.span`
  background-color: ${p => (p.selected ? "var(--color-lapis-lazuli)" : "transparent")};
  border-radius: 0.8rem;
  border: solid 1px var(--color-lapis-lazuli);
  color: ${p => (p.selected ? "white" : "var(--color-lapis-lazuli)")};
  cursor: pointer;
  font-size: 0.8rem;
  margin: 0 0.5rem 0.5rem 0;
  opacity: ${p => (Boolean(p.isDisabled) ? 0.25 : 1)};
  padding: 0.25rem 0.75rem;
  white-space: nowrap;
`;
