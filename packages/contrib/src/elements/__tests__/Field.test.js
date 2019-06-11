import React from "react";
import { render } from "@testing-library/react";
import Field from "../Field";

describe("[Contrib] elements/<Field />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Field />);

    expect(container).toMatchSnapshot();
  });
});
