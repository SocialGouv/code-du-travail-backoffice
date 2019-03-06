import styled from "styled-components";

export default styled.p`
  color: black;
  font-size: 1.25rem;
  font-weight: 600;
  margin: ${props => (props.isFirst ? "0 0 0.5rem" : "1.5rem 0 0.5rem")};
  user-select: none;
`;
