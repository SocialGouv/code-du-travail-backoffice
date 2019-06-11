import React from "react";
import { render } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner";

describe("[Contrib] elements/<LoadingSpinner />", () => {
  it("should match snapshot", () => {
    const { container } = render(<LoadingSpinner size="8rem" />);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with a custom `color` prop", () => {
    const { container } = render(<LoadingSpinner color="blue" />);

    expect(container).toMatchSnapshot();
  });
});
