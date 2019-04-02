import React from "react";
import { render } from "react-testing-library";
import Field from "../Field";

describe("[Contrib] elements/<Field />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Field />);

    expect(container).toMatchSnapshot();
  });
});
