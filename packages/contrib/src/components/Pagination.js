import React from "react";
import ReactPaginate from "react-paginate";
import { Flex } from "rebass";
import styled from "styled-components";

const Container = styled(Flex)`
  user-select: none;
  margin: 1rem 0;

  ul {
    display: flex;
    list-style: none;
    margin-bottom: 0;
    padding-left: 0;
  }

  ul > li {
    a {
      border: solid 1px var(--color-lapis-lazuli);
      border-left: 0;
      color: var(--color-lapis-lazuli);
      cursor: pointer;
      font-size: 0.875rem;
      padding: 0.25rem 0.5rem;

      :hover {
        border: solid 1px var(--color-blue-sapphire);
        border-left: 0;
        color: var(--color-blue-sapphire);
      }
    }

    &.previous,
    &.next {
      margin: 0 1rem;
    }

    &.previous > a {
      border-left: solid 1px var(--color-lapis-lazuli);
      border-radius: 0.25rem;
    }

    &.next > a {
      border-left: solid 1px var(--color-lapis-lazuli);
      border-radius: 0.25rem;
    }

    :nth-child(2) > a {
      border-bottom-left-radius: 0.25rem;
      border-left: solid 1px var(--color-lapis-lazuli);
      border-top-left-radius: 0.25rem;
    }

    :nth-last-child(2) > a {
      border-bottom-right-radius: 0.25rem;
      border-top-right-radius: 0.25rem;
    }

    &.break {
      a {
        background-color: transparent;
        color: inherit;
        cursor: default;

        :hover {
          background-color: transparent;
        }
      }
    }

    &.selected {
      a {
        background-color: var(--color-blue-sapphire);
        border: solid 1px var(--color-blue-sapphire);
        color: white;
        cursor: default;
        font-weight: 600;

        :hover {
          background-color: var(--color-blue-sapphire);
          border: solid 1px var(--color-blue-sapphire);
          color: white;
        }
      }
    }
  }
`;

export default ({ initialPage, onPageChange, pageCount }) => (
  <Container justifyContent="center">
    <ReactPaginate
      disableInitialCallback={true}
      initialPage={initialPage}
      marginPagesDisplayed={3}
      nextLabel="Page suivante"
      onPageChange={onPageChange}
      pageCount={pageCount}
      pageRangeDisplayed={3}
      previousLabel="Page précédente"
    />
  </Container>
);
