import styled from "styled-components";

export default styled.span`
  background-color: ${props => (props.selected ? "black" : "#E6E6E6")};
  border-radius: 0.8rem;
  color: ${props => (props.selected ? "white" : "black")};
  cursor: pointer;
  font-size: 0.8rem;
  white-space: nowrap;
  margin: 0 0.5rem 0.5rem 0;
  padding: 0.25rem 0.75rem;
  user-select: none;
`;
