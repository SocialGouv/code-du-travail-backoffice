import styled from "@emotion/styled";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 1rem;
`;

export const LabelContainer = styled.div`
  color: var(--color-black-leather-jacket);
  line-height: 1;
  min-width: 10rem;
  padding: 0.65rem 0 0;
  width: 10rem;
`;
export const HelpText = styled.div`
  color: var(--color-misty-moss);
  font-size: 0.875rem;
  font-style: italic;
  margin-top: 0.25rem;
`;

export const Error = styled.div`
  color: red;
  font-weight: 600;
  height: 1.5rem;
`;
