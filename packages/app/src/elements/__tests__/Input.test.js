import React from "react";
import { create } from "react-test-renderer";

import Input from "../Input";

describe("elements/<Input />", () => {
  it(`should pass`, () => {
    const $input = create(<Input />);

    expect($input).toHaveTestRenderedStyleRule("border", "solid 1px var(--color-border)");
    expect($input).toHaveTestRenderedStyleRule("opacity", "1");
    expect($input).toHaveTestRenderedStyleRule("padding", "0.6rem 0.6rem 0.625rem 0.6rem");
  });

  it(`should pass with {disabled}`, () => {
    const $input = create(<Input disabled />);

    expect($input).toHaveTestRenderedStyleRule("opacity", "0.25");
  });

  it(`should pass with {hasError}`, () => {
    const $input = create(<Input hasError />);

    expect($input).toHaveTestRenderedStyleRule("border", "solid 1px var(--color-text-red)");
  });

  it(`should pass with {icon}="search"`, () => {
    const $input = create(<Input icon="search" />);

    expect($input).toHaveTestRenderedProperty("icon", "search", "icon");

    expect($input).toHaveTestRenderedStyleRule(
      "border",
      "solid 1px var(--color-border)",
      {},
      "input",
    );
    expect($input).toHaveTestRenderedStyleRule("opacity", "1", {}, "input");
    expect($input).toHaveTestRenderedStyleRule(
      "padding",
      "0.6rem 2.25rem 0.625rem 0.6rem",
      {},
      "input",
    );
  });

  it(`should pass with {icon}="search", {disabled}`, () => {
    const $input = create(<Input disabled icon="search" />);

    expect($input).toHaveTestRenderedStyleRule("opacity", "0.25", {}, "input");
  });

  it(`should pass with {icon}="search", {hasError}`, () => {
    const $input = create(<Input hasError icon="search" />);

    expect($input).toHaveTestRenderedStyleRule(
      "border",
      "solid 1px var(--color-text-red)",
      {},
      "input",
    );
  });
});
