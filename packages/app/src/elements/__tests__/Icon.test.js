import React from "react";
import { create } from "react-test-renderer";

import Icon from "../Icon";

describe("elements/<Icon />", () => {
  const PROPS = {
    color: undefined,
    icon: "book",
    isSmall: undefined,
    role: undefined,
  };

  it(`should pass`, () => {
    const props = {
      ...PROPS,
    };

    const $icon = create(<Icon {...props} />);

    expect($icon).toHaveTestRenderedProperty("color", "var(--color-black-leather-jacket)");
    expect($icon).toHaveTestRenderedProperty("role", "img");
    expect($icon).toHaveTestRenderedClassName("fa-1x");
    expect($icon).toHaveTestRenderedStyleRule("cursor", "default");
    expect($icon).toHaveTestRenderedStyleRule("margin-left", "0");
    expect($icon).toHaveTestRenderedStyleRule("margin-right", "0");
  });

  it(`should pass with {isSmall}`, () => {
    const props = {
      ...PROPS,
      isSmall: true,
    };

    const $icon = create(<Icon {...props} />);

    expect($icon).toHaveTestRenderedClassName("fa-sm");
  });

  it(`should pass with {role} = "button"`, () => {
    const props = {
      ...PROPS,
      role: "button",
    };

    const $icon = create(<Icon {...props} />);

    expect($icon).toHaveTestRenderedProperty("role", "button");
    expect($icon).toHaveTestRenderedStyleRule("cursor", "pointer");
  });

  it(`should pass with {withMarginLeft}`, () => {
    const props = {
      ...PROPS,
      role: "button",
      withMarginLeft: true,
    };

    const $icon = create(<Icon {...props} />);

    expect($icon).toHaveTestRenderedStyleRule("margin-left", "0.5rem");
  });

  it(`should pass with {withMarginRight}`, () => {
    const props = {
      ...PROPS,
      role: "button",
      withMarginRight: true,
    };

    const $icon = create(<Icon {...props} />);

    expect($icon).toHaveTestRenderedStyleRule("margin-right", "0.5rem");
  });
});
