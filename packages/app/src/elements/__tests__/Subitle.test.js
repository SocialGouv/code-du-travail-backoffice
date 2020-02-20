import React from "react";

import Subtitle from "../Subtitle";

describe("elements/<Subtitle />", () => {
  const TEXT = "A Subtitle";

  it(`should pass`, () => {
    const $subtitle = testRender(<Subtitle>{TEXT}</Subtitle>);

    expect($subtitle).toMatchSnapshot();
    expect($subtitle).toHaveStyleRule("margin", "1.5rem 0 0.5rem");
  });

  it(`should pass with {isFirst}`, () => {
    const $subtitle = testRender(<Subtitle isFirst>{TEXT}</Subtitle>);

    expect($subtitle).toHaveStyleRule("margin", "0 0 0.5rem");
  });
});
