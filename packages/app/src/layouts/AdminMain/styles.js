import styled from "@emotion/styled";

export const Content = styled.div`
  display: flex;
  flex-grow: 1;
  overflow-y: ${p => (p.noScroll ? "hidden" : "scroll")};
`;
