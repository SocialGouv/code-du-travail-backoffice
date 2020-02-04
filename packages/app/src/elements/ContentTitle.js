import styled from "@emotion/styled";

export default styled.h3`
  color: black;
  font-size: 1.1rem;
  font-weight: 600;
  margin: ${props => (props.isFirst ? "0 0 0.5rem" : "1.5rem 0 0.5rem")};
  user-select: none;
`;
