import React from "react";
import { create } from "react-test-renderer";

import runTestRenderedProperty from "../../../tests/utils/runTestRenderedProperty";
import Radio from "../Radio";

describe("elements/<Radio />", () => {
  const PROPS = {
    onChange: jest.fn(),
    options: [
      { isSelected: true, label: "A Selected Label", value: "A Selected Value" },
      { label: "A Label", value: "A Value" },
      { label: "Another Label", value: "Another Value" },
    ],
  };

  it(`should not call {onChange} when the selected radio is clicked`, () => {
    const props = {
      ...PROPS,
    };

    const $radio = create(<Radio {...props} />);

    runTestRenderedProperty($radio, "onClick", "bullet-1");

    expect(props.onChange).not.toHaveBeenCalled();
  });

  it(`should call {onChange} when an unselected bullet is clicked`, () => {
    const props = {
      ...PROPS,
    };

    const $radio = create(<Radio {...props} />);

    runTestRenderedProperty($radio, "onClick", "bullet-2");

    expect(props.onChange).toHaveBeenNthCalledWith(1, "A Value");
  });
});
