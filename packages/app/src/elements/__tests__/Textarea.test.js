import { render } from "@testing-library/react";
import React from "react";

import Textarea from "../Textarea";

describe("elements/<Textarea />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Textarea />);

    expect(container).toMatchSnapshot();
  });
});
