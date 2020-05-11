import React from "react";
import { create } from "react-test-renderer";

import Title from "../Title";

describe("elements/<Title />", () => {
  const TEXT = "A Title";

  it(`should pass`, () => {
    const $title = create(<Title>{TEXT}</Title>);

    expect($title).toHaveTestRenderedStyleRule("margin", "1rem 0");
  });
});
