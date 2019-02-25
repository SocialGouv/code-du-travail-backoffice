import React from "react";
import { render } from "react-testing-library";
import Title from "../Title";

describe("<Title />", () => {
  it("should render", () => {
    const { container } = render(<Title />);
    expect(container).toMatchSnapshot();
  });
});
