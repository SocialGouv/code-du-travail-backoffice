import styled from "@emotion/styled";

export const Content = styled.div`
  flex-grow: 1;
  overflow-y: ${p => (p.isScrollable ? "scroll" : "hidden")};
`;
