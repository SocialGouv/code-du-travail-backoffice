import { cleanup, fireEvent, render } from "@testing-library/react";
import React from "react";

import AnswerBlock from "..";
import { ANSWER_STATE } from "../../../constants";

// Ignore styled-wrapped ReactTooltip className prop warning
console.warn = jest.fn();

describe.skip("blocks/<Answer /> (Todo)", () => {
  const props = {
    data: {
      agreement_idcc: "1234",
      agreement_name: "A Labor Agreement Name",
      id: "12345678-9abc-4def-0123-456789abcdef",
      question_index: 12,
      question_value: "Who knows?",
      state: ANSWER_STATE.TO_DO,
    },
    label: "A label",
    onClick: jest.fn(),
    onFallback: jest.fn(),
  };

  const γ = render(<AnswerBlock {...props} />);

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

    expect(props.onFallback).toHaveBeenCalledWith(props.data.id, "national_agreement");
  });
});

describe.skip("blocks/<Answer /> (Draft)", () => {
  const props = {
    data: {
      agreement_idcc: "1234",
      agreement_name: "A Labor Agreement Name",
      generic_reference: null,
      id: "12345678-9abc-4def-0123-456789abcdef",
      prevalue: "A prevalue",
      question_value: "Who knows?",
      state: ANSWER_STATE.DRAFT,
      value: "A value",
    },
    label: "A label",
    onCancel: jest.fn(),
  };

  let γ;

  it("should match snapshot", () => {
    cleanup();

    γ = render(<AnswerBlock {...props} />);

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
        value: "",
      },
    };

    const γ = render(<AnswerBlock {...newProps} />);

    expect(γ.container).toMatchSnapshot();
  });

  it("should match snapshot diff with a National Agreement generic reference", () => {
    const newProps = {
      ...props,
      data: {
        ...props.data,
        generic_reference: "national_agreement",
        value: "",
      },
    };

    cleanup();

    const γ = render(<AnswerBlock {...newProps} />);

    expect(γ.container).toMatchSnapshot();
  });
});
