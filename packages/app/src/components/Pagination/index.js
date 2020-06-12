import PropTypes from "prop-types";
import React from "react";

import { Container, NextButton, PageButton, PreviousButton } from "./index.style";

function renderPageButton({ onChange, pagesIndex, pagesLength }) {
  if (pagesLength <= 5) {
    return [...Array(pagesLength)].map((_, index) => (
      <PageButton
        color={index === pagesIndex ? "info" : "secondary"}
        data-testid={`button-${index + 1}`}
        key={index}
        onClick={() => (index !== pagesIndex ? onChange(index) : undefined)}
      >
        {index + 1}
      </PageButton>
    ));
  }

  const chunks = [];

  if (pagesIndex > 1) {
    chunks.push(
      <PageButton color="secondary" data-testid="button-1" key={0} onClick={() => onChange(0)}>
        1
      </PageButton>,
    );
  }

  if (pagesIndex > 2) {
    chunks.push(
      <span data-testid="separator-left" key="separator-left">
        …
      </span>,
    );
  }

  [...Array(3)].forEach((_, index) => {
    const pageIndex =
      pagesIndex === 0
        ? pagesIndex + index
        : pagesIndex === pagesLength - 1
        ? pagesIndex + index - 2
        : pagesIndex + index - 1;

    chunks.push(
      <PageButton
        color={pageIndex === pagesIndex ? "info" : "secondary"}
        data-testid={`button-${pageIndex + 1}`}
        key={pageIndex}
        onClick={() => (pageIndex !== pagesIndex ? onChange(pageIndex) : undefined)}
      >
        {pageIndex + 1}
      </PageButton>,
    );
  });

  if (pagesIndex < pagesLength - 3) {
    chunks.push(
      <span data-testid="separator-right" key="separator-right">
        …
      </span>,
    );
  }

  if (pagesIndex < pagesLength - 2) {
    chunks.push(
      <PageButton
        color="secondary"
        data-testid={`button-${pagesLength}`}
        key={pagesLength - 1}
        onClick={() => onChange(pagesLength - 1)}
      >
        {pagesLength}
      </PageButton>,
    );
  }

  return chunks;
}

function Pagination({ onChange, pagesIndex, pagesLength }) {
  return (
    <Container alignItems="flex-end" justifyContent="space-between">
      <PreviousButton
        color="secondary"
        data-testid="button-previous"
        icon="caret-left"
        isDisabled={pagesIndex === 0}
        onClick={() => (pagesIndex > 0 ? onChange(pagesIndex - 1) : undefined)}
      />
      {pagesLength !== 0 && <div>{renderPageButton({ onChange, pagesIndex, pagesLength })}</div>}
      <NextButton
        color="secondary"
        data-testid="button-next"
        icon="caret-right"
        isDisabled={pagesIndex === pagesLength - 1}
        onClick={() => (pagesIndex < pagesLength - 1 ? onChange(pagesIndex + 1) : undefined)}
      />
    </Container>
  );
}

Pagination.propTypes = {
  onChange: PropTypes.func.isRequired,
  pagesIndex: PropTypes.number.isRequired,
  pagesLength: PropTypes.number.isRequired,
};

export default Pagination;
