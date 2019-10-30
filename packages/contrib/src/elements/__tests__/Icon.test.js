import React from "react";

import Icon from "../Icon";

describe("[Contrib] elements/<Icon />", () => {
  const COMMON_PROPS = {
    icon: "book"
  };

  it(`should pass`, () => {
    const $icon = testRender(<Icon {...COMMON_PROPS} />);

    expect($icon).toMatchSnapshot();
    expect($icon.props).toHaveProperty("color", "var(--color-black-leather-jacket)");
    expect($icon.props).toHaveProperty("role", "img");
    expect($icon).toHaveStyleRule("cursor", "default");
    expect($icon).toHaveStyleRule("width", "1rem !important");
  });

  it(`should pass with {color} = "red"`, () => {
    const $icon = testRender(<Icon {...COMMON_PROPS} color="red" />);

    expect($icon.props).toHaveProperty("color", "red");
  });

  it(`should pass with {isSmall}`, () => {
    const $icon = testRender(<Icon {...COMMON_PROPS} isSmall />);

    expect($icon).toHaveStyleRule("width", "0.5rem !important");
  });

  it(`should pass with {role} = "button"`, () => {
    const $icon = testRender(<Icon {...COMMON_PROPS} role="button" />);

    expect($icon.props).toHaveProperty("role", "button");
    expect($icon).toHaveStyleRule("cursor", "pointer");
  });
});
