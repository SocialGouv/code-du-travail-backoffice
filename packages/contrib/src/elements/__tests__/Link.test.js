import React from "react";
import { render } from "@testing-library/react";
import Link from "../Link";

describe("[Contrib] elements/<Link />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Link />);

    expect(container).toMatchSnapshot();
  });
});
