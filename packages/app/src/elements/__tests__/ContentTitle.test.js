import React from "react";

import ContentTitle from "../ContentTitle";

describe("elements/<ContentTitle />", () => {
  const TEXT = "A Content Title";

  it(`should pass`, () => {
    const $contentTitle = testRender(<ContentTitle>{TEXT}</ContentTitle>);

    expect($contentTitle).toMatchSnapshot();

    expect($contentTitle).toHaveStyleRule("margin", "1.5rem 0 0.5rem");
  });

  it(`should pass with {isFirst}`, () => {
    const $contentTitle = testRender(<ContentTitle isFirst>{TEXT}</ContentTitle>);

    expect($contentTitle).toHaveStyleRule("margin", "0 0 0.5rem");
  });
});
