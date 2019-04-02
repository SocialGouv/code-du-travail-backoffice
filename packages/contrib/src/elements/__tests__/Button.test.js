import React from "react";
import { render } from "react-testing-library";
import Button from "../Button";

describe("[Contrib] elements/<Button />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Button />);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot", () => {
    const { container } = render(<Button color="secondary" />);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot", () => {
    const { container } = render(<Button hasGroup />);

    expect(container).toMatchSnapshot();
  });
});
