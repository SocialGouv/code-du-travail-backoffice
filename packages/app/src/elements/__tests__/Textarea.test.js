import React from "react";
import { create } from "react-test-renderer";

import Textarea from "../Textarea";

describe("elements/<Textarea />", () => {
  const PROPS = {
    children: "A text",
  };

  it(`should pass`, () => {
    const props = {
      ...PROPS,
    };

    const $title = create(<Textarea {...props} />);

    expect($title).toHaveTestRenderedTextContent(props.children);
  });
});
