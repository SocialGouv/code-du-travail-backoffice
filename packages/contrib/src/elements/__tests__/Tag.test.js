import React from "react";
import { render } from "@testing-library/react";
import Tag from "../Tag";

describe("[Contrib] elements/<Tag />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Tag />);

    expect(container).toMatchSnapshot();
  });
});
