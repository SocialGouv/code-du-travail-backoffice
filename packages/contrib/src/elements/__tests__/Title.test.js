import React from "react";
import { render } from "react-testing-library";
import Title from "../Title";

describe("[Contrib] elements/<Title />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Title />);

    expect(container).toMatchSnapshot();
  });
});
