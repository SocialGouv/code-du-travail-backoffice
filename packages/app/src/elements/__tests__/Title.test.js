import React from "react";

import Title from "../Title";

describe("elements/<Title />", () => {
  const TEXT = "A Title";

  it(`should pass`, () => {
    const $title = testRender(<Title>{TEXT}</Title>);

    expect($title).toMatchSnapshot();

    expect($title).toHaveStyleRule("margin", "1rem 0");
  });
});
