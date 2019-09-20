import React from "react";
import { render } from "@testing-library/react";
import ContentTitle from "../ContentTitle";

describe("[Contrib] elements/<ContentTitle />", () => {
  it("should match snapshot", () => {
    const { container } = render(<ContentTitle />);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with `isFirst` prop", () => {
    const { container } = render(<ContentTitle isFirst />);

    expect(container).toMatchSnapshot();
  });
});
