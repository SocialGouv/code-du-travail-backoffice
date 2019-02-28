import React from "react";
import { render } from "react-testing-library";
import Tag from "../Tag";

describe("[Contrib] elements/<Tag />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Tag />);

    expect(container).toMatchSnapshot();
  });
});
