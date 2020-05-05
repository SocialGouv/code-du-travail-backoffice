import React from "react";

import Radio from "../Radio";

describe("elements/<Radio />", () => {
  const COMMON_PROPS = {
    onChange: jest.fn(),
    options: [
      { isSelected: true, label: "A Selected Label", value: "A Selected Value" },
      { label: "A Label", value: "A Value" },
      { label: "Another Label", value: "Another Value" },
    ],
  };

  it(`should pass`, () => {
    const $radio = testRender(<Radio {...COMMON_PROPS} />);
    const $firstBullet = $radio.children[0].findByType("svg");
    const $secondBullet = $radio.children[1].findByType("svg");

    expect($radio).toMatchSnapshot();

    expect($radio).toHaveTestRenderedProp("role", "radiogroup");

    expect($firstBullet).toHaveTestRenderedProp("aria-checked", "true");
    expect($firstBullet).toHaveTestRenderedProp("aria-hidden", "false");
    expect($firstBullet).toHaveTestRenderedProp("data-icon", "dot-circle");
    expect($firstBullet).toHaveTestRenderedProp("tabIndex", "0");
    expect($firstBullet).toHaveTestRenderedProp("role", "radio");

    expect($secondBullet).toHaveTestRenderedProp("aria-checked", "false");
    expect($secondBullet).toHaveTestRenderedProp("aria-hidden", "false");
    expect($secondBullet).toHaveTestRenderedProp("data-icon", "circle");
    expect($secondBullet).toHaveTestRenderedProp("tabIndex", "-1");
    expect($secondBullet).toHaveTestRenderedProp("role", "radio");
  });

  it(`should not call {onChange} when the selected radio is clicked`, () => {
    const $radio = testRender(<Radio {...COMMON_PROPS} />);
    const $firstBullet = $radio.children[0].findByType("svg");

    expect($firstBullet.onClick).toBeUndefined();
  });

  it(`should call {onChange} when an unselected radio is clicked`, () => {
    const $radio = testRender(<Radio {...COMMON_PROPS} />);
    const $secondBullet = $radio.children[1].findByType("svg");

    $secondBullet.props.onClick();

    expect(COMMON_PROPS.onChange).toHaveBeenCalledTimes(1);
    expect(COMMON_PROPS.onChange).toHaveBeenCalledWith("A Value");
  });
});
