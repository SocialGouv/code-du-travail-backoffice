import React from "react";
import { render } from "react-testing-library";
import Link from "../Link";

describe("[Contrib] elements/<Link />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Link />);

    expect(container).toMatchSnapshot();
  });
});
