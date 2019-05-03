import React from "react";
import { fireEvent, render } from "react-testing-library";

import "../../../../__mocks__/waitFor";

import AnswerEditionReferences from "..";

describe("[Contrib] blocks/<AnswerEditionReferences />", () => {
  const props = {
    // eslint-disable-next-line prettier/prettier
    laborCodeReferences:
      require("../../../../static/data/labor-law-references.json"),
    onAdd: jest.fn(),
    onRemove: jest.fn(),
    references: [
      {
        url: null,
        value: "L1234-5",
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
    getByTitle,
    getByPlaceholderText,
    queryAllByText,
    queryByText
  } = render(<AnswerEditionReferences {...props} />);
  const firstRender = asFragment();

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
    expect(queryByText(props.references[0].value)).toBeInTheDocument();
    expect(queryByText(props.references[1].value)).toBeInTheDocument();
  });

  it("should add the expected Labor Code reference", async () => {
    const newReference = {
      category: "labor_code",
      url: null,
      value: "L1234-6"
    };

    fireEvent.input(
      getByPlaceholderText(
        "Commencez à taper le nom de la référence au Code du travail"
      ),
      {
        target: { value: newReference.value }
      }
    );
    await waitFor(0);
    fireEvent.click(queryByText(newReference.value));
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(queryByText(newReference.value)).toBeInTheDocument();
    expect(props.onAdd).toHaveBeenCalledWith(newReference);
  });

  it("should remove the expected Labor Code reference", async () => {
    fireEvent.click(
      getByTitle(
        `Bouton supprimant la référence au Code du travail : ${
          props.references[0].value
        }`
      )
    );
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(queryByText(props.references[0].value)).not.toBeInTheDocument();
    expect(props.onRemove).toHaveBeenCalledWith(props.references[0].value);
  });

  it("should add the expected uncategorized reference", async () => {
    const newReference = {
      category: null,
      url: "https://example.com/other",
      value: "A New Uncategorized Reference"
    };

    fireEvent.input(
      getByPlaceholderText("Référence (ex: Décret n°82-447 du 28 mai 1982…)"),
      {
        target: { value: newReference.value }
      }
    );
    await waitFor(0);
    fireEvent.input(
      getByPlaceholderText("URL (ex: https://www.legifrance.gouv.fr/…)"),
      {
        target: { value: newReference.url }
      }
    );
    await waitFor(0);
    fireEvent.click(getByTitle("Ajouter la référence juridique"));
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(queryByText(newReference.value)).toBeInTheDocument();
    expect(props.onAdd).toHaveBeenCalledWith(newReference);
  });

  it("should remove the expected uncategorized reference", async () => {
    fireEvent.click(
      getByTitle(
        `Bouton supprimant la référence juridique : ${
          props.references[1].value
        }`
      )
    );
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(queryByText(props.references[1].value)).not.toBeInTheDocument();
    expect(props.onRemove).toHaveBeenCalledWith(props.references[1].value);
  });

  it("should not duplicate an existing uncategorized reference", async () => {
    const duplicateReferenceValue = "A New Uncategorized Reference";

    expect(queryAllByText(duplicateReferenceValue).length).toBe(1);

    fireEvent.input(
      getByPlaceholderText("Référence (ex: Décret n°82-447 du 28 mai 1982…)"),
      {
        target: { value: duplicateReferenceValue }
      }
    );
    await waitFor(0);
    fireEvent.click(getByTitle("Ajouter la référence juridique"));
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(queryAllByText(duplicateReferenceValue).length).toBe(1);
  });
});
