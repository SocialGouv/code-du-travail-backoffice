import React from "react";
import { create } from "react-test-renderer";

import ContentTitle from "../ContentTitle";

describe("elements/<ContentTitle />", () => {
  const TEXT = "A Content Title";

  it(`should pass`, () => {
    const $contentTitle = create(<ContentTitle>{TEXT}</ContentTitle>);

    expect($contentTitle).toHaveTestRenderedStyleRule("margin", "1.5rem 0 0.5rem");
  });

  it(`should pass with {isFirst}`, () => {
    const $contentTitle = create(<ContentTitle isFirst>{TEXT}</ContentTitle>);

    expect($contentTitle).toHaveTestRenderedStyleRule("margin", "0 0 0.5rem");
  });
});
