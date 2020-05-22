import React from "react";
import { create } from "react-test-renderer";

import runTestRenderedProperty from "../../../tests/utils/runTestRenderedProperty";
import Checkbox from "../Checkbox";

describe("elements/<Checkbox />", () => {
  it(`should pass with {checked} = true`, () => {
    const $checkbox = create(<Checkbox isChecked />);

    expect($checkbox).toHaveTestRenderedProperty("icon", "check-square");
    expect($checkbox).toHaveTestRenderedProperty("isTransparent", true);
    expect($checkbox).toHaveTestRenderedProperty("role", "checkbox");
  });

  it(`should pass with {checked} = false`, () => {
    const $checkbox = create(<Checkbox isChecked={false} />);

    expect($checkbox).toHaveTestRenderedProperty("icon", "square");
    expect($checkbox).toHaveTestRenderedProperty("isTransparent", true);
    expect($checkbox).toHaveTestRenderedProperty("role", "checkbox");
  });

  it(`should call {onClick}`, () => {
    const props = {
      isChecked: true,
      onClick: jest.fn(),
    };
    const $checkbox = create(<Checkbox {...props} />);

    runTestRenderedProperty($checkbox, "onClick");

    expect(props.onClick).toHaveBeenCalledTimes(1);
  });
});
