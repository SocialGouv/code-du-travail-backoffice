import React from "react";
import { render } from "react-testing-library";
import Login from "../login";

describe("[Contrib] pages/<Login />", () => {
  it("should render", () => {
    const { container } = render(<Login />);

    expect(container).toMatchSnapshot();
  });
});
