import React from "react";
import { create } from "react-test-renderer";

import Hr from "../Hr";

describe("elements/<Hr />", () => {
  it(`should pass`, () => {
    const $hr = create(<Hr />);

    expect($hr).toHaveTestRenderedType("hr");
  });
});
