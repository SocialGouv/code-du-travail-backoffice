import React from "react";
import { render } from "react-testing-library";
import Title from "../Title";

describe("[Contrib] elements/<Title />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Title />);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with `isFirst` prop", () => {
    const { container } = render(<Title isFirst />);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with `isSecondary` prop", () => {
    const { container } = render(<Title isSecondary />);

    expect(container).toMatchSnapshot();
  });
});
