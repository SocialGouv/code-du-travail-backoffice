import React from "react";
import { create } from "react-test-renderer";

import Link from "../Link";

describe("elements/<Link />", () => {
  it(`should pass`, () => {
    const $link = create(<Link />);

    expect($link).toHaveTestRenderedType("button");
  });
});
