import React from "react";
import { create } from "react-test-renderer";

import runTestRenderedProperty from "../../../tests/utils/runTestRenderedProperty";
import Button from "../Button";

describe("elements/<Button />", () => {
  const ICON = "sync";
  const TEXT = "A Button";

  it(`should pass`, () => {
    // const $button = create(<Button>{TEXT}</Button>);
    const $button = create(<Button>{TEXT}</Button>);

    expect($button).toHaveTestRenderedStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveTestRenderedStyleRule("color", "white");
    expect($button).toHaveTestRenderedStyleRule("cursor", "pointer");
    expect($button).toHaveTestRenderedStyleRule("margin-left", "0");
    expect($button).toHaveTestRenderedStyleRule("margin-right", "0");
    expect($button).toHaveTestRenderedStyleRule("opacity", "0.75");
    expect($button).toHaveTestRenderedStyleRule("padding", "0.3rem 1rem 0.3rem");
    expect($button).toHaveTestRenderedStyleRule("opacity", "1", { target: ":hover" });
    expect($button).toHaveTestRenderedStyleRule("cursor", "pointer", { target: "svg" });
  });

  it(`should pass with {color} = "danger"`, () => {
    const $button = create(
      <Button color="danger" icon={ICON}>
        {TEXT}
      </Button>,
    );

    expect($button).toHaveTestRenderedStyleRule("background-color", "var(--color-shadow)");
    expect($button).toHaveTestRenderedStyleRule("color", "white");

    expect($button).toHaveTestRenderedProperty("color", "white", "icon");
  });

  it(`should pass with {color} = "info"`, () => {
    const $button = create(
      <Button color="info" icon={ICON}>
        {TEXT}
      </Button>,
    );

    expect($button).toHaveTestRenderedStyleRule("background-color", "var(--color-misty-moss)");
    expect($button).toHaveTestRenderedStyleRule("color", "white");

    expect($button).toHaveTestRenderedProperty("color", "white", "icon");
  });

  it(`should pass with {color} = "primary"`, () => {
    const $button = create(
      <Button color="primary" icon={ICON}>
        {TEXT}
      </Button>,
    );

    expect($button).toHaveTestRenderedStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveTestRenderedStyleRule("color", "white");

    expect($button).toHaveTestRenderedProperty("color", "white", "icon");
  });

  it(`should pass with {color} = "secondary"`, () => {
    const $button = create(
      <Button color="secondary" icon={ICON}>
        {TEXT}
      </Button>,
    );

    expect($button).toHaveTestRenderedStyleRule("background-color", "var(--color-periwinkle)");
    expect($button).toHaveTestRenderedStyleRule("color", "var(--color-eerie-black)");

    expect($button).toHaveTestRenderedProperty("color", "var(--color-eerie-black)", "icon");
  });

  it(`should pass with {color} = "warning"`, () => {
    const $button = create(
      <Button color="warning" icon={ICON}>
        {TEXT}
      </Button>,
    );

    expect($button).toHaveTestRenderedStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveTestRenderedStyleRule("color", "white");

    expect($button).toHaveTestRenderedProperty("color", "white", "icon");
  });

  it(`should pass with {icon} = "sync"`, () => {
    const $button = create(<Button icon={ICON}>{TEXT}</Button>);

    expect($button).toHaveTestRenderedStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveTestRenderedStyleRule("margin-right", "0.25rem", { target: "svg" });
    expect($button).toHaveTestRenderedStyleRule("padding-top", "0.125rem", { target: "svg" });
  });

  it(`should pass with {icon} = "sync" and no children`, () => {
    const $button = create(<Button icon={ICON} />);

    expect($button).toHaveTestRenderedStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveTestRenderedStyleRule("margin-right", "0", { target: "svg" });
    expect($button).toHaveTestRenderedStyleRule("padding-top", "0", { target: "svg" });
  });

  it(`should pass with {icon} = "sync", no children and {isDisabled}`, () => {
    const $button = create(<Button icon={ICON} isDisabled />);

    expect($button).toHaveTestRenderedStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveTestRenderedStyleRule("cursor", "not-allowed");
    expect($button).toHaveTestRenderedStyleRule("cursor", "not-allowed", { target: "svg" });
    expect($button).toHaveTestRenderedStyleRule("margin-right", "0", { target: "svg" });
    expect($button).toHaveTestRenderedStyleRule("padding-top", "0", { target: "svg" });
  });

  it(`should pass with {isDisabled}`, () => {
    const $button = create(<Button isDisabled>{TEXT}</Button>);

    expect($button).toHaveTestRenderedStyleRule("cursor", "not-allowed");
    expect($button).toHaveTestRenderedStyleRule("opacity", "0.25");
    expect($button).toHaveTestRenderedStyleRule("opacity", "0.25", { target: ":hover" });
    expect($button).toHaveTestRenderedStyleRule("cursor", "not-allowed", { target: "svg" });
  });

  it(`should pass with {isSmall}`, () => {
    const $button = create(<Button isSmall>{TEXT}</Button>);

    expect($button).toHaveTestRenderedStyleRule("padding", "0.1rem 0.4rem 0.15rem");
  });

  it(`should pass with {isTransparent}`, () => {
    const $button = create(<Button isTransparent>{TEXT}</Button>);

    expect($button).toHaveTestRenderedStyleRule("background-color", "transparent");
    expect($button).toHaveTestRenderedStyleRule("color", "var(--color-lapis-lazuli)");
  });

  it(`should pass with {onClick}`, () => {
    const onClick = jest.fn();
    const $button = create(<Button onClick={onClick}>{TEXT}</Button>);

    runTestRenderedProperty($button, "onClick");

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it(`should pass with {withMarginLeft}`, () => {
    const $button = create(<Button withMarginLeft>{TEXT}</Button>);

    expect($button).toHaveTestRenderedStyleRule("margin-left", "1rem");
    expect($button).toHaveTestRenderedStyleRule("margin-right", "0");
  });

  it(`should pass with {withMarginRight}`, () => {
    const $button = create(<Button withMarginRight>{TEXT}</Button>);

    expect($button).toHaveTestRenderedStyleRule("margin-left", "0");
    expect($button).toHaveTestRenderedStyleRule("margin-right", "1rem");
  });
});
