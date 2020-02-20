import "../../../../tests/globals/waitFor";

import { cleanup, fireEvent, render } from "@testing-library/react";
import React from "react";

import Tags from "..";

describe.skip("components/<Tags />", () => {
  const props = {
    ariaName: "le tag",
    isEditable: true,
    onAdd: jest.fn(),
    onRemove: jest.fn(),
    selectedTags: [{ value: "A Tag" }, { value: "Another Tag" }],
    tags: [{ value: "A Tag" }, { value: "Another Tag" }, { value: "Yet Another Tag" }],
  };

  const γ = render(<Tags {...props} />);

  it("should match snapshot", () => {
    expect(γ.container).toMatchSnapshot();
    expect(γ.queryByText(props.tags[0].value)).toBeInTheDocument();
    expect(γ.queryByText(props.tags[1].value)).toBeInTheDocument();
    expect(γ.queryByText(props.tags[2].value)).not.toBeInTheDocument();
  });

  it("should show the expected suggestion", () => {
    fireEvent.input(γ.getByPlaceholderText(`Commencez à taper le nom du tag`), {
      target: { value: "yet" },
    });

    expect(γ.queryByText(props.tags[2].value)).toBeInTheDocument();
  });

  it("should add the expected tag", async () => {
    fireEvent.click(γ.queryByText(props.tags[2].value));

    expect(props.onAdd).toHaveBeenCalledWith(props.tags[2]);
    expect(γ.getByPlaceholderText(`Commencez à taper le nom du tag`).value).toBe("");
    expect(γ.queryByText(props.tags[0].value)).toBeInTheDocument();
    expect(γ.queryByText(props.tags[1].value)).toBeInTheDocument();
    expect(γ.queryByText(props.tags[2].value)).toBeInTheDocument();
    expect(
      γ.queryByAltText(`Bouton supprimant ${props.ariaName} ${props.tags[2].value}`),
    ).toBeInTheDocument();
  });

  it("should remove the expected tag", async () => {
    fireEvent.click(γ.getByAltText(`Bouton supprimant ${props.ariaName} ${props.tags[0].value}`));

    expect(props.onRemove).toHaveBeenCalledWith(props.tags[0]);
    expect(γ.queryByText(props.tags[0].value)).not.toBeInTheDocument();
    expect(γ.queryByText(props.tags[1].value)).toBeInTheDocument();
    expect(γ.queryByText(props.tags[2].value)).toBeInTheDocument();
  });

  it("should show the expected suggestions", () => {
    fireEvent.input(γ.getByPlaceholderText(`Commencez à taper le nom du tag`), {
      target: { value: "a" },
    });

    expect(γ.getByPlaceholderText(`Commencez à taper le nom du tag`).value).toBe("a");
    expect(γ.queryByText(props.tags[0].value)).toBeInTheDocument();
  });

  it("should hide the suggestion when the input is emptied", () => {
    fireEvent.input(γ.getByPlaceholderText(`Commencez à taper le nom du tag`), {
      target: { value: "" },
    });

    expect(γ.getByPlaceholderText(`Commencez à taper le nom du tag`).value).toBe("");
    expect(γ.queryByText(props.tags[0].value)).not.toBeInTheDocument();
  });
});

describe.skip("components/<Tags /> without optional props", () => {
  const props = {
    isEditable: true,
    onAdd: jest.fn(),
    onRemove: jest.fn(),
  };

  let γ;

  it("should match snapshot", () => {
    cleanup();

    γ = render(<Tags {...props} />);

    expect(γ.container).toMatchSnapshot();
  });
});

describe.skip("components/<Tags /> without `isEditable`", () => {
  const props = {
    onAdd: jest.fn(),
    onRemove: jest.fn(),
    selectedTags: [{ value: "A Tag" }, { value: "Another Tag" }],
    tags: [{ value: "A Tag" }, { value: "Another Tag" }, { value: "Yet Another Tag" }],
  };

  let γ;

  it("should match snapshot", () => {
    cleanup();

    γ = render(<Tags {...props} />);

    expect(γ.container).toMatchSnapshot();
  });
});
