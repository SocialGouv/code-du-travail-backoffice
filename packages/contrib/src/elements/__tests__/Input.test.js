import React from "react";

import Input from "../Input";

describe("[Contrib] elements/<Input />", () => {
  it(`should pass`, () => {
    const $input = testRender(<Input />);

    expect($input).toMatchSnapshot();
    expect($input).toHaveStyleRule("border", "solid 1px var(--color-border)");
    expect($input).toHaveStyleRule("opacity", "1");
  });

  it(`should pass with {disabled}`, () => {
    const $input = testRender(<Input disabled />);

    expect($input).toHaveStyleRule("opacity", "0.25");
  });

  it(`should pass with {hasError}`, () => {
    const $input = testRender(<Input hasError />);

    expect($input).toHaveStyleRule("border", "solid 1px var(--color-text-red)");
  });

  it(`should pass with a {icon} = "search"`, () => {
    const $input = testRender(<Input icon="search" />);
    const $icon = $input
      .findByType("div")
      .findByType("span")
      .findByType("svg");

    expect($input).toMatchSnapshot();
    expect($icon.props).toHaveProperty("data-icon", "search");
  });
});
