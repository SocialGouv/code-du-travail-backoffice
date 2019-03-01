import React from "react";
import { render } from "react-testing-library";
import Spinner from "../Spinner";

describe("[Contrib] elements/<Spinner />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Spinner size="8rem" />);

    expect(container).toMatchSnapshot();
  });
});
