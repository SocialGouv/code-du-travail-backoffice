import React from "react";
import { render } from "react-testing-library";
import SavingSpinner from "../SavingSpinner";

describe("[Contrib] elements/<SavingSpinner />", () => {
  it("should match snapshot", () => {
    const { container } = render(<SavingSpinner />);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot", () => {
    const { container } = render(<SavingSpinner color="red" />);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot", () => {
    const { container } = render(<SavingSpinner size="32" />);

    expect(container).toMatchSnapshot();
  });
});
