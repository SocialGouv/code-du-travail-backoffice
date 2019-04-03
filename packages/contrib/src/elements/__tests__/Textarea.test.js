import React from "react";
import { render } from "react-testing-library";

import Textarea from "../Textarea";

describe("[Contrib] elements/<Textarea />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Textarea />);

    expect(container).toMatchSnapshot();
  });
});
