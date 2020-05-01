import React from "react";

import Button from "../Button";

describe("elements/<Button />", () => {
  const ICON = "sync";
  const TEXT = "A Button";

  it(`should pass`, () => {
    const $button = testRender(<Button>{TEXT}</Button>);

    expect($button).toHaveStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveStyleRule("color", "white");
    expect($button).toHaveStyleRule("cursor", "pointer");
    expect($button).toHaveStyleRule("margin-left", "0");
    expect($button).toHaveStyleRule("margin-right", "0");
    expect($button).toHaveStyleRule("opacity", "0.75");
    expect($button).toHaveStyleRule("padding", "0.3rem 1rem 0.3rem");
    expect($button).toHaveStyleRule("opacity", "1", { target: ":hover" });
    expect($button).toHaveStyleRule("cursor", "pointer", { target: "svg" });
  });

  it(`should pass with {color} = "danger"`, () => {
    const $button = testRender(
      <Button color="danger" icon={ICON}>
        {TEXT}
      </Button>,
    );
    const $icon = $button.findByType("svg");

    expect($icon).toHaveTestRenderedProp("color", "white");

    expect($button).toHaveStyleRule("background-color", "var(--color-shadow)");
    expect($button).toHaveStyleRule("color", "white");
  });

  it(`should pass with {color} = "info"`, () => {
    const $button = testRender(
      <Button color="info" icon={ICON}>
        {TEXT}
      </Button>,
    );
    const $icon = $button.findByType("svg");

    expect($icon).toHaveTestRenderedProp("color", "white");

    expect($button).toHaveStyleRule("background-color", "var(--color-misty-moss)");
    expect($button).toHaveStyleRule("color", "white");
  });

  it(`should pass with {color} = "primary"`, () => {
    const $button = testRender(
      <Button color="primary" icon={ICON}>
        {TEXT}
      </Button>,
    );
    const $icon = $button.findByType("svg");

    expect($icon).toHaveTestRenderedProp("color", "white");

    expect($button).toHaveStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveStyleRule("color", "white");
  });

  it(`should pass with {color} = "secondary"`, () => {
    const $button = testRender(
      <Button color="secondary" icon={ICON}>
        {TEXT}
      </Button>,
    );
    const $icon = $button.findByType("svg");

    expect($icon).toHaveTestRenderedProp("color", "var(--color-eerie-black)");

    expect($button).toHaveStyleRule("background-color", "var(--color-periwinkle)");
    expect($button).toHaveStyleRule("color", "var(--color-eerie-black)");
  });

  it(`should pass with {color} = "warning"`, () => {
    const $button = testRender(
      <Button color="warning" icon={ICON}>
        {TEXT}
      </Button>,
    );
    const $icon = $button.findByType("svg");

    expect($icon).toHaveTestRenderedProp("color", "white");

    expect($button).toHaveStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveStyleRule("color", "white");
  });

  it(`should pass with {icon} = "sync"`, () => {
    const $button = testRender(<Button icon={ICON}>{TEXT}</Button>);

    expect($button).toHaveStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveStyleRule("margin-right", "0.25rem", { target: "svg" });
    expect($button).toHaveStyleRule("padding-top", "0.125rem", { target: "svg" });
  });

  it(`should pass with {icon} = "sync" and no children`, () => {
    const $button = testRender(<Button icon={ICON} />);

    expect($button).toHaveStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveStyleRule("margin-right", "0", { target: "svg" });
    expect($button).toHaveStyleRule("padding-top", "0", { target: "svg" });
  });

  it(`should pass with {icon} = "sync", no children and {isDisabled}`, () => {
    const $button = testRender(<Button icon={ICON} isDisabled />);

    expect($button).toHaveStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveStyleRule("cursor", "not-allowed");
    expect($button).toHaveStyleRule("cursor", "not-allowed", { target: "svg" });
    expect($button).toHaveStyleRule("margin-right", "0", { target: "svg" });
    expect($button).toHaveStyleRule("padding-top", "0", { target: "svg" });
  });

  it(`should pass with {isDisabled}`, () => {
    const $button = testRender(<Button isDisabled>{TEXT}</Button>);

    expect($button).toHaveStyleRule("cursor", "not-allowed");
    expect($button).toHaveStyleRule("opacity", "0.25");
    expect($button).toHaveStyleRule("opacity", "0.25", { target: ":hover" });
    expect($button).toHaveStyleRule("cursor", "not-allowed", { target: "svg" });
  });

  it(`should pass with {isSmall}`, () => {
    const $button = testRender(<Button isSmall>{TEXT}</Button>);

    expect($button).toHaveStyleRule("padding", "0.1rem 0.4rem 0.15rem");
  });

  it(`should pass with {isTransparent}`, () => {
    const $button = testRender(<Button isTransparent>{TEXT}</Button>);

    expect($button).toHaveStyleRule("background-color", "transparent");
    expect($button).toHaveStyleRule("color", "var(--color-lapis-lazuli)");
  });

  it(`should pass with {onClick}`, () => {
    const onClick = jest.fn();
    const $button = testRender(<Button onClick={onClick}>{TEXT}</Button>);

    $button.props.onClick();

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it(`should pass with {withMarginLeft}`, () => {
    const $button = testRender(<Button withMarginLeft>{TEXT}</Button>);

    expect($button).toHaveStyleRule("margin-left", "1rem");
    expect($button).toHaveStyleRule("margin-right", "0");
  });

  it(`should pass with {withMarginRight}`, () => {
    const $button = testRender(<Button withMarginRight>{TEXT}</Button>);

    expect($button).toHaveStyleRule("margin-left", "0");
    expect($button).toHaveStyleRule("margin-right", "1rem");
  });
});
