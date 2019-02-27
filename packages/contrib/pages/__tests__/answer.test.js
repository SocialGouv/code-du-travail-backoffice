import React from "react";
import { render } from "react-testing-library";
import Answer from "../answer";

describe("[Contrib] pages/<Answer />", () => {
  it("should render", () => {
    const { container } = render(<Answer />);

    expect(container).toMatchSnapshot();
  });
});
