import styled from "@emotion/styled";
import { Flex } from "rebass";

import _Input from "../../elements/Input";

export const Container = styled(Flex)`
  .react-tags {
    flex-grow: 1;
    position: relative;
  }

  .react-tags__search-input {
    -webkit-appearance: none;
    border: solid 1px var(--color-border);
    color: inherit;
    flex-grow: 1;
    font-family: inherit;
    font-weight: inherit;
    font-size: 0.875rem;
    line-height: 1;
    padding: 0.6rem 0.6rem 0.625rem 0.6rem;
    width: 100% !important;

    ::placeholder {
      color: var(--color-placeholder);
    }

    :focus {
      box-shadow: 0 0 0 1px var(--color-text-blue) !important;
    }
  }

  .react-tags__suggestions {
    position: absolute;

    > ul {
      list-style: none;
      padding: 0;
      /* position: absolute; */
      z-index: 2;

      > li {
        background-color: var(--color-alice-blue);
        border: solid 1px var(--color-border);
        border-top: 0;
        cursor: pointer;
        padding: 0.25rem 0.5rem;

        &:hover {
          background-color: var(--color-periwinkle);
        }

        &.is-active {
          background-color: var(--color-cadet-grey);
        }
      }
    }
  }
`;

export const Input = styled(_Input)`
  flex-grow: 0;
  margin-right: 0.5rem;
  max-width: 3.5rem;
  width: auto;
`;
