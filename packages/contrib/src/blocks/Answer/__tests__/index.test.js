import React from "react";
import { fireEvent, render } from "react-testing-library";

import Answer from "..";

// Ignore styled-wrapped ReactTooltip className prop warning
console.warn = jest.fn();

describe.skip("[Contrib] blocks/<Answer /> (Undraft)", () => {
  const props = {
    data: {
      id: "12345678-9abc-4def-0123-456789abcdef",
      idcc: "1234",
      agreement: "A Labor Agreement Name",
      question: "Who knows?"
    },
    isDraft: false,
    label: "A label",
    onClick: jest.fn(),
    onFallback: jest.fn()
  };
  const { container, getByText } = render(<Answer {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should have called onClick() with the expected param", () => {
    fireEvent.click(getByText(/Who knows/));

    expect(props.onClick).toHaveBeenCalledWith(props.data.id);
  });

  it("should have called onFallback() with the expected params", () => {
    fireEvent.click(getByText(/Renvoi au Code du travail/));

    expect(props.onFallback).toHaveBeenCalledWith(props.data.id, "labor_code");
  });

  it("should have called onFallback() with the expected params", () => {
    fireEvent.click(getByText(/Renvoi à la CC nationale/));

    expect(props.onFallback).toHaveBeenCalledWith(
      props.data.id,
      "national_agreement"
    );
  });
});

describe("[Contrib] blocks/<Answer /> (Draft)", () => {
  const props = {
    data: {
      id: "12345678-9abc-4def-0123-456789abcdef",
      idcc: "1234",
      agreement: "A Labor Agreement Name",
      question: "Who knows?",
      generic_reference: null,
      value: "A strange answer."
    },
    isDraft: true,
    label: "A label",
    onCancel: jest.fn()
  };

  const { asFragment, container, getByText } = render(<Answer {...props} />);
  const firstRender = asFragment();

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should have called onCancel() with the expected param", () => {
    fireEvent.click(getByText(/Annuler ma réponse/));

    expect(props.onCancel).toHaveBeenCalledWith(props.data.id);
  });

  it("should match snapshot diff with a Labor Code generic reference", () => {
    const newProps = {
      ...props,
      data: {
        ...props.data,
        generic_reference: "labor_code",
        value: ""
      }
    };

    const { asFragment } = render(<Answer {...newProps} />);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
  });

  // eslint-disable-next-line max-len
  it("should match snapshot diff with a National Agreement generic reference", () => {
    const newProps = {
      ...props,
      data: {
        ...props.data,
        generic_reference: "national_agreement",
        value: ""
      }
    };

    const { asFragment } = render(<Answer {...newProps} />);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
  });
});
