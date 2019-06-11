import React from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";

import Answer from "..";

// Ignore styled-wrapped ReactTooltip className prop warning
console.warn = jest.fn();

describe("[Contrib] blocks/<Answer /> (Undraft)", () => {
  const props = {
    data: {
      id: "12345678-9abc-4def-0123-456789abcdef",
      idcc: "1234",
      index: 12,
      agreement: "A Labor Agreement Name",
      question: "Who knows?"
    },
    isDraft: false,
    label: "A label",
    onClick: jest.fn(),
    onFallback: jest.fn()
  };

  const γ = render(<Answer {...props} />);

  it("should match snapshot", () => {
    expect(γ.container).toMatchSnapshot();
  });

  it("should have called onClick() with the expected param", () => {
    fireEvent.click(γ.getByText(/Who knows/));

    expect(props.onClick).toHaveBeenCalledWith(props.data.id);
  });

  it("should have called onFallback() with the expected params (CDT)", () => {
    fireEvent.click(γ.getByText(/Renvoi au Code du travail/));

    expect(props.onFallback).toHaveBeenCalledWith(props.data.id, "labor_code");
  });

  it("should have called onFallback() with the expected params (CCN)", () => {
    fireEvent.click(γ.getByText(/Renvoi à la CC nationale/));

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

  let γ;

  it("should match snapshot", () => {
    cleanup();

    γ = render(<Answer {...props} />);

    expect(γ.container).toMatchSnapshot();
  });

  it("should have called onCancel() with the expected param", () => {
    fireEvent.click(γ.getByText(/Annuler ma réponse/));

    expect(props.onCancel).toHaveBeenCalledWith(props.data.id);
  });

  it("should match snapshot diff with a Labor Code generic reference", () => {
    cleanup();

    const newProps = {
      ...props,
      data: {
        ...props.data,
        generic_reference: "labor_code",
        value: ""
      }
    };

    const γ = render(<Answer {...newProps} />);

    expect(γ.container).toMatchSnapshot();
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

    cleanup();

    const γ = render(<Answer {...newProps} />);

    expect(γ.container).toMatchSnapshot();
  });
});
