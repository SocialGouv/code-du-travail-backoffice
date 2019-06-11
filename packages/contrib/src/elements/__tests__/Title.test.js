import React from "react";
import { render } from "@testing-library/react";
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
});
