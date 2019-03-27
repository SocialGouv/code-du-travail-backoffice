import React from "react";
import { fireEvent, render } from "react-testing-library";

import AnswerEditionReferences from "..";

describe("[Contrib] blocks/<AnswerEditionReferences />", () => {
  const onAdd = jest.fn();
  const onRemove = jest.fn();

  const props = {
    onAdd,
    onRemove,
    references: [
      {
        url: null,
        value: "A Labor Code Reference",
        category: "labor_code"
      },
      {
        url: "https://example.com",
        value: "An Uncategorized Reference",
        category: null
      }
    ]
  };

  const {
    asFragment,
    container,
    getByAltText,
    getByPlaceholderText,
    getAllByRole,
    queryAllByText,
    queryByText
  } = render(<AnswerEditionReferences {...props} />);
  const firstRender = asFragment();
  const forms = getAllByRole(/form/);
  const $laborCodeReferenceForm = forms[0];
  const $referenceForm = forms[1];

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
    expect(queryByText(/A Labor Code Reference/)).toBeInTheDocument();
    expect(queryByText(/An Uncategorized Reference/)).toBeInTheDocument();
  });

  it("should add the expected Labor Code reference", () => {
    const newReference = {
      category: "labor_code",
      url: null,
      value: "A New Labor Code Reference"
    };

    fireEvent.input(getByPlaceholderText("Référence (ex: L. 1234-5)"), {
      target: { value: newReference.value }
    });
    fireEvent.submit($laborCodeReferenceForm);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(queryByText(newReference.value)).toBeInTheDocument();
    expect(onAdd).toHaveBeenCalledWith(newReference);
  });

  it("should add the expected uncategorized reference", () => {
    const newReference = {
      category: null,
      url: "https://example.com/other",
      value: "A New Uncategorized Reference"
    };

    fireEvent.input(
      getByPlaceholderText("Référence (ex: Décret n° 1 du 1er janvier 2019)"),
      {
        target: { value: newReference.value }
      }
    );
    fireEvent.input(getByPlaceholderText("Lien (ex: https://...)"), {
      target: { value: newReference.url }
    });
    fireEvent.submit($referenceForm);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(queryByText(newReference.value)).toBeInTheDocument();
    expect(onAdd).toHaveBeenCalledWith(newReference);
  });

  it("should remove the expected reference", () => {
    fireEvent.click(
      getByAltText(
        /Bouton supprimant la référence juridique A Labor Code Reference/
      )
    );

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(queryByText(/A Labor Code Reference/)).not.toBeInTheDocument();
    expect(onRemove).toHaveBeenCalledWith(props.references[0].value);
  });

  it("should not duplicate an existing reference value", () => {
    const duplicateReferenceValue = "A New Labor Code Reference";

    expect(queryAllByText(duplicateReferenceValue).length).toBe(1);

    fireEvent.input(getByPlaceholderText("Référence (ex: L. 1234-5)"), {
      target: { value: duplicateReferenceValue }
    });
    fireEvent.submit($laborCodeReferenceForm);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(queryAllByText(duplicateReferenceValue).length).toBe(1);
  });
});
