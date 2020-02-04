import React from "react";

import Checkbox from "../Checkbox";

describe("[Contrib] elements/<Checkbox />", () => {
  it(`should pass`, () => {
    const $button = testRender(<Checkbox />);
    const $icon = $button.findByType("svg");

    expect($button).toMatchSnapshot();
    expect($button).toHaveStyleRule("background-color", "transparent");
    expect($icon.props).toHaveProperty("data-icon", "square");
    expect($icon.props).toHaveProperty("color", "var(--color-lapis-lazuli)");
  });

  it(`should pass with {color} = "danger"`, () => {
    const $button = testRender(<Checkbox color="danger" />);
    const $icon = $button.findByType("svg");

    expect($button).toHaveStyleRule("background-color", "transparent");
    expect($icon.props).toHaveProperty("color", "var(--color-shadow)");
  });

  it(`should pass with {color} = "info"`, () => {
    const $button = testRender(<Checkbox color="info" />);
    const $icon = $button.findByType("svg");

    expect($button).toHaveStyleRule("background-color", "transparent");
    expect($icon.props).toHaveProperty("color", "var(--color-misty-moss)");
  });

  it(`should pass with {color} = "primary"`, () => {
    const $button = testRender(<Checkbox color="primary" />);
    const $icon = $button.findByType("svg");

    expect($button).toHaveStyleRule("background-color", "transparent");
    expect($icon.props).toHaveProperty("color", "var(--color-lapis-lazuli)");
  });

  it(`should pass with {color} = "secondary"`, () => {
    const $button = testRender(<Checkbox color="secondary" />);
    const $icon = $button.findByType("svg");

    expect($button).toHaveStyleRule("background-color", "transparent");
    expect($icon.props).toHaveProperty("color", "var(--color-periwinkle)");
  });

  it(`should pass with {color} = "warning"`, () => {
    const $button = testRender(<Checkbox color="warning" />);
    const $icon = $button.findByType("svg");

    expect($button).toHaveStyleRule("background-color", "transparent");
    expect($icon.props).toHaveProperty("color", "var(--color-lapis-lazuli)");
  });

  it(`should pass with {isChecked}`, () => {
    const $button = testRender(<Checkbox isChecked />);
    const $icon = $button.findByType("svg");

    expect($icon.props).toHaveProperty("data-icon", "check-square");
  });

  it(`should call {onClick}`, () => {
    const props = {
      onClick: jest.fn()
    };
    const $button = testRender(<Checkbox {...props} />);

    $button.props.onClick();
    expect(props.onClick).toHaveBeenCalled();
  });
});
