import React from "react";
import { create } from "react-test-renderer";

import Subtitle from "../Subtitle";

describe("elements/<Subtitle />", () => {
  const TEXT = "A Subtitle";

  it(`should pass`, () => {
    const $subtitle = create(<Subtitle>{TEXT}</Subtitle>);

    expect($subtitle).toHaveTestRenderedStyleRule("margin", "1.5rem 0 0.5rem");
  });

  it(`should pass with {isFirst}`, () => {
    const $subtitle = create(<Subtitle isFirst>{TEXT}</Subtitle>);

    expect($subtitle).toHaveTestRenderedStyleRule("margin", "0 0 0.5rem");
  });
});
