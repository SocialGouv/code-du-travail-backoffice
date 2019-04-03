import styled from "styled-components";

export default styled.p`
  color: black;
  font-size: ${props => (Boolean(props.isSecondary) ? "1.1" : "1.25")}rem;
  font-weight: 600;
  margin: ${props => (props.isFirst ? "0 0 0.5rem" : "1.5rem 0 0.5rem")};
  user-select: none;
`;
