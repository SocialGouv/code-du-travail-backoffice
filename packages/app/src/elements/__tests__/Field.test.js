import React from "react";
import { create } from "react-test-renderer";

import Field from "../Field";

describe("elements/<Field />", () => {
  const PROPS = {
    children: "A text",
  };

  it(`should pass`, () => {
    const props = {
      ...PROPS,
    };

    const $field = create(<Field {...props} />);

    expect($field).toHaveTestRenderedTextContent(props.children);
  });

  it(`should pass with {error}`, () => {
    const props = {
      ...PROPS,
      error: "An error",
    };

    const $field = create(<Field {...props} />);

    expect($field).toHaveTestRenderedTextContent(props.error, "error");
  });
});
