import React from "react";

import Tag from "../Tag";

describe("elements/<Tag />", () => {
  it(`should pass`, () => {
    const $tag = testRender(<Tag />);

    expect($tag).toMatchSnapshot();
    expect($tag).toHaveStyleRule("background-color", "transparent");
    expect($tag).toHaveStyleRule("color", "var(--color-lapis-lazuli)");
    expect($tag).toHaveStyleRule("opacity", "1");
  });

  it(`should pass with {disabled}`, () => {
    const $tag = testRender(<Tag isDisabled />);

    expect($tag).toHaveStyleRule("opacity", "0.25");
  });

  it(`should pass with {selected}`, () => {
    const $tag = testRender(<Tag selected />);

    expect($tag).toHaveStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($tag).toHaveStyleRule("color", "white");
  });
});
