import React from "react";
import { fireEvent, render } from "react-testing-library";

import "../../../../__mocks__/waitFor";

import Tags from "..";

describe("[Contrib] components/<Tags />", () => {
  const props = {
    ariaName: "le tag",
    isEditable: true,
    onAdd: jest.fn(),
    onRemove: jest.fn(),
    selectedTags: [{ value: "A Tag" }, { value: "Another Tag" }],
    tags: [
      { value: "A Tag" },
      { value: "Another Tag" },
      { value: "Yet Another Tag" }
    ]
  };

  const {
    asFragment,
    container,
    getByAltText,
    getByPlaceholderText,
    queryByAltText,
    queryByText
  } = render(<Tags {...props} />);
  const firstRender = asFragment();

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
    expect(queryByText(props.tags[0].value)).toBeInTheDocument();
    expect(queryByText(props.tags[1].value)).toBeInTheDocument();
    expect(queryByText(props.tags[2].value)).not.toBeInTheDocument();
  });

  it("should show the expected suggestion", () => {
    fireEvent.input(getByPlaceholderText(`Commencez à taper le nom du tag`), {
      target: { value: "yet" }
    });

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(queryByText(props.tags[2].value)).toBeInTheDocument();
  });

  it("should add the expected tag", async () => {
    fireEvent.click(queryByText(props.tags[2].value));

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(props.onAdd).toHaveBeenCalledWith(props.tags[2]);
    expect(getByPlaceholderText(`Commencez à taper le nom du tag`).value).toBe(
      ""
    );
    expect(queryByText(props.tags[0].value)).toBeInTheDocument();
    expect(queryByText(props.tags[1].value)).toBeInTheDocument();
    expect(queryByText(props.tags[2].value)).toBeInTheDocument();
    expect(
      queryByAltText(
        `Bouton supprimant ${props.ariaName} ${props.tags[2].value}`
      )
    ).toBeInTheDocument();
  });

  it("should remove the expected tag", async () => {
    fireEvent.click(
      getByAltText(`Bouton supprimant ${props.ariaName} ${props.tags[0].value}`)
    );

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(props.onRemove).toHaveBeenCalledWith(props.tags[0]);
    expect(queryByText(props.tags[0].value)).not.toBeInTheDocument();
    expect(queryByText(props.tags[1].value)).toBeInTheDocument();
    expect(queryByText(props.tags[2].value)).toBeInTheDocument();
  });

  it("should show the expected suggestions", () => {
    fireEvent.input(getByPlaceholderText(`Commencez à taper le nom du tag`), {
      target: { value: "a" }
    });

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(getByPlaceholderText(`Commencez à taper le nom du tag`).value).toBe(
      "a"
    );
    expect(queryByText(props.tags[0].value)).toBeInTheDocument();
  });

  it("should hide the suggestion when the input is emptied", () => {
    fireEvent.input(getByPlaceholderText(`Commencez à taper le nom du tag`), {
      target: { value: "" }
    });

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(getByPlaceholderText(`Commencez à taper le nom du tag`).value).toBe(
      ""
    );
    expect(queryByText(props.tags[0].value)).not.toBeInTheDocument();
  });
});

describe("[Contrib] components/<Tags /> without optional props", () => {
  const props = {
    isEditable: true,
    onAdd: jest.fn(),
    onRemove: jest.fn()
  };

  const { asFragment, container, getByPlaceholderText } = render(
    <Tags {...props} />
  );
  const firstRender = asFragment();

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should ot show any suggestion", () => {
    fireEvent.input(
      getByPlaceholderText(`Commencez à taper le nom de l'étiquette`),
      {
        target: { value: "a" }
      }
    );

    expect(firstRender).toMatchDiffSnapshot(null);
  });
});
