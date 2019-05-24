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
        category: "labor_code",
        url: null,
        value: "L1234-5"
      },
      {
        category: null,
        url: "https://example.com",
        value: "An Uncategorized Reference"
      },
      {
        category: "agreement",
        url: null,
        value: "An Agreement Reference"
      }
    ]
  };

  const γ = render(<AnswerEditionReferences {...props} />);

  it("should match snapshot", () => {
    expect(γ.container).toMatchSnapshot();
    expect(γ.queryByText(props.references[0].value)).toBeInTheDocument();
    expect(γ.queryByText(props.references[1].value)).toBeInTheDocument();
    expect(γ.queryByText(props.references[2].value)).toBeInTheDocument();
  });

  it("should add the expected Labor Code reference", async () => {
    const newReference = {
      category: "labor_code",
      url: null,
      value: "L1234-6"
    };

    fireEvent.input(
      γ.getByPlaceholderText(
        "Commencez à taper le nom de la référence au Code du travail"
      ),
      {
        target: { value: newReference.value }
      }
    );
    await waitFor(0);
    fireEvent.click(γ.queryByText(newReference.value));
    await waitFor(0);

    expect(γ.queryByText(newReference.value)).toBeInTheDocument();
    expect(props.onAdd).toHaveBeenCalledWith(newReference);
  });

  it("should remove the expected Labor Code reference", async () => {
    fireEvent.click(
      γ.getByTitle(
        `Bouton supprimant la référence au Code du travail : ${
          props.references[0].value
        }`
      )
    );
    await waitFor(0);

    expect(γ.queryByText(props.references[0].value)).not.toBeInTheDocument();
    expect(props.onRemove).toHaveBeenCalledWith(props.references[0].value);
  });

  it("should add the expected Agreement reference", async () => {
    const newAgreementReference = {
      category: "agreement",
      url: null,
      value: "A New Agreement Reference"
    };

    fireEvent.input(
      γ.getByPlaceholderText("Ex: Article 7, Texte sur les salaires de 1984…"),
      {
        target: { value: newAgreementReference.value }
      }
    );
    await waitFor(0);
    fireEvent.click(
      γ.getByTitle("Ajouter la référence à la convention collective")
    );
    await waitFor(0);

    expect(γ.queryByText(newAgreementReference.value)).toBeInTheDocument();
    expect(props.onAdd).toHaveBeenCalledWith(newAgreementReference);
  });

  it("should remove the expected Agreement reference", async () => {
    fireEvent.click(
      γ.getByTitle(
        `Bouton supprimant la référence à la convention collective : ${
          props.references[2].value
        }`
      )
    );
    await waitFor(0);

    expect(γ.queryByText(props.references[2].value)).not.toBeInTheDocument();
    expect(props.onRemove).toHaveBeenCalledWith(props.references[2].value);
  });

  it("should not duplicate an existing Agreement reference", async () => {
    const duplicateAgreementReferenceValue = "A New Agreement Reference";

    expect(γ.queryAllByText(duplicateAgreementReferenceValue).length).toBe(1);

    fireEvent.input(
      γ.getByPlaceholderText("Ex: Article 7, Texte sur les salaires de 1984…"),
      {
        target: { value: duplicateAgreementReferenceValue }
      }
    );
    await waitFor(0);
    fireEvent.click(
      γ.getByTitle("Ajouter la référence à la convention collective")
    );
    await waitFor(0);

    expect(γ.queryAllByText(duplicateAgreementReferenceValue).length).toBe(1);
  });

  it("should not add an empty Agreement reference", async () => {
    expect(γ.queryAllByTitle(/Bouton supprimant/).length).toBe(3);

    fireEvent.input(
      γ.getByPlaceholderText("Ex: Article 7, Texte sur les salaires de 1984…"),
      {
        target: { value: " " }
      }
    );
    await waitFor(0);
    fireEvent.click(
      γ.getByTitle("Ajouter la référence à la convention collective")
    );
    await waitFor(0);

    expect(γ.queryAllByTitle(/Bouton supprimant/).length).toBe(3);
  });

  it("should add the expected uncategorized reference", async () => {
    const newReference = {
      category: null,
      url: "https://example.com/other",
      value: "A New Uncategorized Reference"
    };

    fireEvent.input(
      γ.getByPlaceholderText("Référence (ex: Décret n°82-447 du 28 mai 1982…)"),
      {
        target: { value: newReference.value }
      }
    );
    await waitFor(0);
    fireEvent.input(
      γ.getByPlaceholderText("URL (ex: https://www.legifrance.gouv.fr/…)"),
      {
        target: { value: newReference.url }
      }
    );
    await waitFor(0);
    fireEvent.click(γ.getByTitle("Ajouter la référence juridique"));
    await waitFor(0);

    expect(γ.queryByText(newReference.value)).toBeInTheDocument();
    expect(props.onAdd).toHaveBeenCalledWith(newReference);
  });

  it("should remove the expected uncategorized reference", async () => {
    fireEvent.click(
      γ.getByTitle(
        `Bouton supprimant la référence juridique : ${
          props.references[1].value
        }`
      )
    );
    await waitFor(0);

    expect(γ.queryByText(props.references[1].value)).not.toBeInTheDocument();
    expect(props.onRemove).toHaveBeenCalledWith(props.references[1].value);
  });

  it("should not duplicate an existing uncategorized reference", async () => {
    const duplicateReferenceValue = "A New Uncategorized Reference";

    expect(γ.queryAllByText(duplicateReferenceValue).length).toBe(1);

    fireEvent.input(
      γ.getByPlaceholderText("Référence (ex: Décret n°82-447 du 28 mai 1982…)"),
      {
        target: { value: duplicateReferenceValue }
      }
    );
    await waitFor(0);
    fireEvent.click(γ.getByTitle("Ajouter la référence juridique"));
    await waitFor(0);

    expect(γ.queryAllByText(duplicateReferenceValue).length).toBe(1);
  });

  it("should not add an empty uncategorized reference", async () => {
    expect(γ.queryAllByTitle(/Bouton supprimant/).length).toBe(3);

    fireEvent.input(
      γ.getByPlaceholderText("Référence (ex: Décret n°82-447 du 28 mai 1982…)"),
      {
        target: { value: " " }
      }
    );
    await waitFor(0);
    fireEvent.click(γ.getByTitle("Ajouter la référence juridique"));
    await waitFor(0);

    expect(γ.queryAllByTitle(/Bouton supprimant/).length).toBe(3);
  });

  it("should not add an empty uncategorized reference URL", async () => {
    const newReferenceWithEmptyUrl = {
      category: null,
      url: " ",
      value: "A New Uncategorized Reference With An Empty URL"
    };

    expect(γ.queryAllByTitle(/Bouton supprimant/).length).toBe(3);
    expect(γ.queryAllByTitle(/Bouton ouvrant le lien/).length).toBe(1);

    fireEvent.input(
      γ.getByPlaceholderText("Référence (ex: Décret n°82-447 du 28 mai 1982…)"),
      {
        target: { value: newReferenceWithEmptyUrl.value }
      }
    );
    await waitFor(0);
    fireEvent.input(
      γ.getByPlaceholderText("URL (ex: https://www.legifrance.gouv.fr/…)"),
      {
        target: { value: newReferenceWithEmptyUrl.url }
      }
    );
    await waitFor(0);
    fireEvent.click(γ.getByTitle("Ajouter la référence juridique"));
    await waitFor(0);

    expect(γ.queryAllByTitle(/Bouton supprimant/).length).toBe(4);
    expect(γ.queryAllByTitle(/Bouton ouvrant le lien/).length).toBe(1);
  });
});
