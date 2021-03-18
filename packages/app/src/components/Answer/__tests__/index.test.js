import React from "react";
import { create } from "react-test-renderer";

import Answer from "..";
import runTestRenderedProperty from "../../../../tests/utils/runTestRenderedProperty";

describe("components/<Answer />", () => {
  const PROPS = {
    data: {
      agreement_id: null,
      agreement_idcc: null,
      agreement_name: null,
      created_at: "1970-01-01T00:00:00.000000+00:00",
      generic_reference: null,
      id: "00000000-0000-4000-8000-000000000001",
      parent_id: null,
      prevalue: "A prevalue",
      question_id: "00000000-0000-4000-8000-000000000001",
      question_index: 1,
      question_value: "A question",
      state: "todo",
      updated_at: "1970-01-01T00:00:00.000000+00:00",
      value: "A value",
    },
    isChecked: false,
    onCheck: jest.fn(),
    onClick: jest.fn(),
  };

  it(`should pass with a todo answer`, () => {
    const props = {
      ...PROPS,
    };

    const $answer = create(<Answer {...props} />);

    expect($answer).toHaveTestRenderedTextContent(`à rédiger`, "state");

    expect($answer).toHaveTestRenderedProperty("isChecked", false, "checkbox");

    runTestRenderedProperty($answer, "onClick", "checkbox");

    expect(props.onCheck).toHaveBeenNthCalledWith(1, props.data.id);

    runTestRenderedProperty($answer, "onClick", "content");

    expect(props.onClick).toHaveBeenNthCalledWith(1, props.data.id);
  });

  it(`should pass with a checked todo answer`, () => {
    const props = {
      ...PROPS,
      isChecked: true,
    };

    const $answer = create(<Answer {...props} />);

    expect($answer).toHaveTestRenderedProperty("isChecked", true, "checkbox");
  });

  it(`should pass with a draft generic answer`, () => {
    const props = {
      ...PROPS,
      data: {
        ...PROPS.data,
        state: "draft",
      },
    };

    const $answer = create(<Answer {...props} />);

    expect($answer).toHaveTestRenderedTextContent(`en cours de rédaction`, "state");

    expect($answer).toHaveTestRenderedProperty("isChecked", false, "checkbox");

    expect($answer).toHaveTestRenderedTextContent(props.data.prevalue, "extract");

    runTestRenderedProperty($answer, "onClick", "checkbox");

    expect(props.onCheck).toHaveBeenNthCalledWith(1, props.data.id);

    runTestRenderedProperty($answer, "onClick", "content");

    expect(props.onClick).toHaveBeenNthCalledWith(1, props.data.id);
  });

  it(`should pass with a published validated answer`, () => {
    const props = {
      ...PROPS,
      data: {
        ...PROPS.data,
        state: "validated",
      },
    };

    const $answer = create(<Answer {...props} />);

    expect($answer).toHaveTestRenderedTextContent(`validée`, "state");

    expect($answer).toHaveTestRenderedTextContent(props.data.value, "extract");
    expect($answer).toHaveTestRenderedStyleRule("color", "var(--color-text-gray)", {}, "extract");
  });

  it(`should pass with a Labor Code forwarded answer`, () => {
    const props = {
      ...PROPS,
      data: {
        ...PROPS.data,
        generic_reference: "labor_code",
        state: "validated",
      },
    };

    const $answer = create(<Answer {...props} />);

    expect($answer).toHaveTestRenderedTextContent(`Renvoyé au Code du travail.`, "extract");
    expect($answer).toHaveTestRenderedStyleRule("color", "var(--color-text-red)", {}, "extract");
  });

  it(`should pass with a National Agreement forwarded answer`, () => {
    const props = {
      ...PROPS,
      data: {
        ...PROPS.data,
        generic_reference: "national_agreement",
        state: "validated",
      },
    };

    const $answer = create(<Answer {...props} />);

    expect($answer).toHaveTestRenderedTextContent(
      `Renvoyé à la convention collective nationale.`,
      "extract",
    );
    expect($answer).toHaveTestRenderedStyleRule("color", "var(--color-text-red)", {}, "extract");
  });
});
