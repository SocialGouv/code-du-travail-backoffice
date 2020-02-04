import React from "react";

import Title from "../Title";

describe("[Contrib] elements/<Title />", () => {
  const TEXT = "A Title";

  it(`should pass`, () => {
    const $title = testRender(<Title>{TEXT}</Title>);

    expect($title).toMatchSnapshot();
    expect($title).toHaveStyleRule("margin", "1.5rem 0 0.5rem");
  });

  it(`should pass with {isFirst}`, () => {
    const $title = testRender(<Title isFirst>{TEXT}</Title>);

    expect($title).toHaveStyleRule("margin", "0 0 0.5rem");
  });
});
