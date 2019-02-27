import React from "react";
import { render } from "react-testing-library";
import Index from "../index";

describe("[Contrib] pages/<Index />", () => {
  it("should render", () => {
    const { container } = render(<Index />);

    expect(container).toMatchSnapshot();
  });
});
