import React from "react";
import { render } from "react-testing-library";

import Login from "../Login";

describe("[Contrib] components/<Login />", () => {
  const onLog = jest.fn();
  const { container } = render(<Login onLog={onLog} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });
});
