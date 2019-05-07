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
      color: inherit;
      cursor: pointer;
      font-size: 0.875rem;
      padding: 0.25rem 0.5rem;
      text-decoration: underline;
    }

    &.break {
      a {
        color: inherit;
        cursor: default;
      }
    }

    &.selected {
      a {
        color: inherit;
        cursor: default;
        font-weight: 600;
        text-decoration: none;
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
      nextLabel="Suivant >"
      onPageChange={onPageChange}
      pageCount={pageCount}
      pageRangeDisplayed={3}
      previousLabel="< Précédent"
    />
  </Container>
);
