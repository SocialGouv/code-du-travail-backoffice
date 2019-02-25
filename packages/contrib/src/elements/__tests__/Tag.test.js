import React from "react";
import { render } from "react-testing-library";
import Tag from "../Tag";

describe("<Tag />", () => {
  it("should render", () => {
    const { container } = render(<Tag />);
    expect(container).toMatchSnapshot();
  });
});
