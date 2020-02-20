import React from "react";

import Radio from "../Radio";

describe("elements/<Radio />", () => {
  const COMMON_PROPS = {
    options: [
      { isSelected: true, label: "A Selected Label", value: "A Selected Value" },
      { label: "A Label", value: "A Value" },
      { label: "Another Label", value: "Another Value" }
    ]
  };

  it(`should pass`, () => {
    const $radio = testRender(<Radio {...COMMON_PROPS} />);
    const $firstSvg = $radio.children[0].findByType("svg");
    const $secondSvg = $radio.children[1].findByType("svg");

    expect($radio).toMatchSnapshot();
    expect($radio.props).toHaveProperty("role", "radiogroup");
    expect($firstSvg.props).toHaveProperty("aria-checked", "true");
    expect($secondSvg.props).toHaveProperty("aria-hidden", "false");
    expect($firstSvg.props).toHaveProperty("data-icon", "dot-circle");
    expect($firstSvg.props).toHaveProperty("tabIndex", "0");
    expect($firstSvg.props).toHaveProperty("role", "radio");
    expect($secondSvg.props).toHaveProperty("aria-checked", "false");
    expect($secondSvg.props).toHaveProperty("aria-hidden", "false");
    expect($secondSvg.props).toHaveProperty("data-icon", "circle");
    expect($secondSvg.props).toHaveProperty("tabIndex", "-1");
    expect($secondSvg.props).toHaveProperty("role", "radio");
  });

  it(`should not call {onChange} when the selected radio is clicked`, () => {
    const props = {
      onChange: jest.fn()
    };
    const $radio = testRender(<Radio {...props} {...COMMON_PROPS} />);
    const $firstSvg = $radio.children[0].findByType("svg");

    $firstSvg.props.onClick();
    expect(props.onChange).not.toHaveBeenCalled();
  });

  it(`should call {onChange} when a unselected radio is clicked`, () => {
    const props = {
      onChange: jest.fn()
    };
    const $radio = testRender(<Radio {...props} {...COMMON_PROPS} />);
    const $secondSvg = $radio.children[1].findByType("svg");

    $secondSvg.props.onClick();
    expect(props.onChange).toHaveBeenCalledWith("A Value");
  });
});
