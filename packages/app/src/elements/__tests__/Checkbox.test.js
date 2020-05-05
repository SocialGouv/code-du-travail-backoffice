import React from "react";

import Checkbox from "../Checkbox";

describe("elements/<Checkbox />", () => {
  it(`should pass with {checked} = true`, () => {
    const $button = testRender(<Checkbox isChecked />);
    const $icon = $button.findByType("svg");

    expect($icon).toHaveTestRenderedProp("data-icon", "check-square");
    expect($icon).toHaveTestRenderedProp("color", "var(--color-lapis-lazuli)");

    expect($button).toHaveStyleRule("background-color", "transparent");
  });

  it(`should pass with {checked} = false`, () => {
    const $button = testRender(<Checkbox isChecked={false} />);
    const $icon = $button.findByType("svg");

    expect($icon).toHaveTestRenderedProp("data-icon", "square");
    expect($icon).toHaveTestRenderedProp("color", "var(--color-lapis-lazuli)");

    expect($button).toHaveStyleRule("background-color", "transparent");
  });

  it(`should pass with {color} = "danger"`, () => {
    const $button = testRender(<Checkbox color="danger" isChecked />);
    const $icon = $button.findByType("svg");

    expect($icon).toHaveTestRenderedProp("color", "var(--color-shadow)");

    expect($button).toHaveStyleRule("background-color", "transparent");
  });

  it(`should pass with {color} = "info"`, () => {
    const $button = testRender(<Checkbox color="info" isChecked />);
    const $icon = $button.findByType("svg");

    expect($icon).toHaveTestRenderedProp("color", "var(--color-misty-moss)");

    expect($button).toHaveStyleRule("background-color", "transparent");
  });

  it(`should pass with {color} = "primary"`, () => {
    const $button = testRender(<Checkbox color="primary" isChecked />);
    const $icon = $button.findByType("svg");

    expect($icon).toHaveTestRenderedProp("color", "var(--color-lapis-lazuli)");

    expect($button).toHaveStyleRule("background-color", "transparent");
  });

  it(`should pass with {color} = "secondary"`, () => {
    const $button = testRender(<Checkbox color="secondary" isChecked />);
    const $icon = $button.findByType("svg");

    expect($icon).toHaveTestRenderedProp("color", "var(--color-periwinkle)");

    expect($button).toHaveStyleRule("background-color", "transparent");
  });

  it(`should pass with {color} = "warning"`, () => {
    const $button = testRender(<Checkbox color="warning" isChecked />);
    const $icon = $button.findByType("svg");

    expect($icon).toHaveTestRenderedProp("color", "var(--color-lapis-lazuli)");

    expect($button).toHaveStyleRule("background-color", "transparent");
  });

  it(`should call {onClick}`, () => {
    const props = {
      onClick: jest.fn(),
    };
    const $button = testRender(<Checkbox isChecked {...props} />);

    $button.props.onClick();
    expect(props.onClick).toHaveBeenCalled();
  });
});
