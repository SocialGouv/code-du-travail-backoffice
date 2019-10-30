import React from "react";

import Button from "../Button";

describe("[Contrib] elements/<Button />", () => {
  const ICON = "sync";
  const TEXT = "A Button";

  it(`should pass`, () => {
    const $button = testRender(<Button>{TEXT}</Button>);

    expect($button).toMatchSnapshot();
    expect($button).toHaveStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveStyleRule("color", "white");
    expect($button).toHaveStyleRule("cursor", "pointer");
    expect($button).toHaveStyleRule("margin-right", "0");
    expect($button).toHaveStyleRule("opacity", "1");
    expect($button).toHaveStyleRule("padding", "0.3rem 1rem 0.3rem");
    expect($button).toHaveStyleRule("opacity", "1", { target: ":hover" });
    expect($button).toHaveStyleRule("cursor", "pointer", { target: "svg" });
  });

  it(`should pass with {color} = "danger"`, () => {
    const $button = testRender(
      <Button color="danger" icon={ICON}>
        {TEXT}
      </Button>
    );
    const $icon = $button.findByType("svg");

    expect($icon.props).toHaveProperty("color", "white");
    expect($button).toHaveStyleRule("background-color", "var(--color-shadow)");
    expect($button).toHaveStyleRule("color", "white");
  });

  it(`should pass with {color} = "info"`, () => {
    const $button = testRender(
      <Button color="info" icon={ICON}>
        {TEXT}
      </Button>
    );
    const $icon = $button.findByType("svg");

    expect($icon.props).toHaveProperty("color", "white");
    expect($button).toHaveStyleRule("background-color", "var(--color-misty-moss)");
    expect($button).toHaveStyleRule("color", "white");
  });

  it(`should pass with {color} = "primary"`, () => {
    const $button = testRender(
      <Button color="primary" icon={ICON}>
        {TEXT}
      </Button>
    );
    const $icon = $button.findByType("svg");

    expect($icon.props).toHaveProperty("color", "white");
    expect($button).toHaveStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveStyleRule("color", "white");
  });

  it(`should pass with {color} = "secondary"`, () => {
    const $button = testRender(
      <Button color="secondary" icon={ICON}>
        {TEXT}
      </Button>
    );
    const $icon = $button.findByType("svg");

    expect($icon.props).toHaveProperty("color", "var(--color-eerie-black)");
    expect($button).toHaveStyleRule("background-color", "var(--color-periwinkle)");
    expect($button).toHaveStyleRule("color", "var(--color-eerie-black)");
  });

  it(`should pass with {color} = "warning"`, () => {
    const $button = testRender(
      <Button color="warning" icon={ICON}>
        {TEXT}
      </Button>
    );
    const $icon = $button.findByType("svg");

    expect($icon.props).toHaveProperty("color", "white");
    expect($button).toHaveStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveStyleRule("color", "white");
  });

  it(`should pass with {disabled}`, () => {
    const $button = testRender(<Button disabled>{TEXT}</Button>);

    expect($button).toHaveStyleRule("cursor", "not-allowed");
    expect($button).toHaveStyleRule("opacity", "0.25");
    expect($button).toHaveStyleRule("opacity", "0.25", { target: ":hover" });
    expect($button).toHaveStyleRule("cursor", "not-allowed", { target: "svg" });
  });

  it(`should pass with {hasGroup}`, () => {
    const $button = testRender(<Button hasGroup>{TEXT}</Button>);

    expect($button).toHaveStyleRule("margin-right", "1rem");
  });

  it(`should pass with {icon} = "sync"`, () => {
    const $button = testRender(<Button icon={ICON}>{TEXT}</Button>);

    expect($button).toMatchSnapshot();
    expect($button).toHaveStyleRule("background-color", "var(--color-lapis-lazuli)");
    expect($button).toHaveStyleRule("margin-right", "0.25rem", { target: "svg" });
    expect($button).toHaveStyleRule("padding-top", "0.125rem", { target: "svg" });
  });

  it(`should have a transparent background with {icon} = "sync" and no children`, () => {
    const $button = testRender(<Button icon={ICON} />);

    expect($button).toMatchSnapshot();
    expect($button).toHaveStyleRule("background-color", "transparent");
    expect($button).toHaveStyleRule("margin-right", "0", { target: "svg" });
    expect($button).toHaveStyleRule("padding-top", "0", { target: "svg" });
  });

  it(`should pass with {isSmall}`, () => {
    const $button = testRender(<Button isSmall>{TEXT}</Button>);

    expect($button).toHaveStyleRule("padding", "0.1rem 0.5rem 0.15rem");
  });
});
