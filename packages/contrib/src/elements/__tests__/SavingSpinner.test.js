import React from "react";
import { render } from "react-testing-library";
import SavingSpinner from "../SavingSpinner";

describe("[Contrib] elements/<SavingSpinner />", () => {
  it("should match snapshot", () => {
    const { container } = render(<SavingSpinner size="8rem" />);

    expect(container).toMatchSnapshot();
  });
});
