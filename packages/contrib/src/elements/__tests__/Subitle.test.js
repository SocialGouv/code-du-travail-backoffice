import React from "react";
import { render } from "react-testing-library";
import Subtitle from "../Subtitle";

describe("[Contrib] elements/<Subtitle />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Subtitle />);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with `isFirst` prop", () => {
    const { container } = render(<Subtitle isFirst />);

    expect(container).toMatchSnapshot();
  });
});
