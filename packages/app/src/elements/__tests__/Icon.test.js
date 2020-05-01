import React from "react";

import Icon from "../Icon";

describe("elements/<Icon />", () => {
  const COMMON_PROPS = {
    icon: "book",
  };

  it(`should pass`, () => {
    const $icon = testRender(<Icon {...COMMON_PROPS} />);

    expect($icon).toMatchSnapshot();

    expect($icon).toHaveTestRenderedProp("color", "var(--color-black-leather-jacket)");
    expect($icon).toHaveTestRenderedProp("data-icon", COMMON_PROPS.icon);
    expect($icon).toHaveTestRenderedProp("role", "img");

    expect($icon).toHaveTestRenderedClass("fa-1x");
    expect($icon).toHaveStyleRule("cursor", "default");
  });

  it(`should pass with {color} = "red"`, () => {
    const $icon = testRender(<Icon color="red" {...COMMON_PROPS} />);

    expect($icon).toHaveTestRenderedProp("color", "red");
  });

  it(`should pass with {isSmall}`, () => {
    const $icon = testRender(<Icon isSmall {...COMMON_PROPS} />);

    expect($icon).toHaveTestRenderedClass("fa-sm");
  });

  it(`should pass with {role} = "button"`, () => {
    const $icon = testRender(<Icon {...COMMON_PROPS} role="button" />);

    expect($icon).toHaveTestRenderedProp("role", "button");

    expect($icon).toHaveStyleRule("cursor", "pointer");
  });
});
