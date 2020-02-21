import styled from "@emotion/styled";

export const Container = styled.div`
  .react-tags__selected > button {
    border: solid 1px var(--color-border);
  }

  .react-tags__search-input > input {
    -webkit-appearance: none;
    border: solid 1px var(--color-border);
    color: inherit;
    flex-grow: 1;
    font-family: inherit;
    font-weight: inherit;
    font-size: 0.875rem;
    height: 2rem;
    line-height: 1;
    padding: 0.5rem 0.6rem 0.55rem;
    width: 100% !important;

    ::placeholder {
      color: var(--color-placeholder);
    }
  }

  .react-tags__suggestions > ul {
    list-style: none;
    padding: 0;

    li {
      background-color: var(--color-alice-blue);
      border: solid 1px var(--color-border);
      border-top: 0;
      cursor: pointer;
      padding: 0.25rem 0.5rem;

      &.is-active {
        background-color: var(--color-cadet-grey);
      }
    }
  }
`;
