import React from "react";
import { fireEvent, render } from "@testing-library/react";

import Checkbox from "../Checkbox";

describe("[Contrib] elements/<Checkbox />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Checkbox />);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with a custom `color` prop", () => {
    const { container } = render(<Checkbox color="secondary" />);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with `isChecked` prop", () => {
    const { container } = render(<Checkbox isChecked />);

    expect(container).toMatchSnapshot();
  });

  it("should have called onClick()", () => {
    const props = {
      "data-testid": generateTestId(),
      onClick: jest.fn()
    };
    const λ = render(<Checkbox {...props} />);

    fireEvent.click(λ.getByTestId(props["data-testid"]));

    expect(props.onClick).toHaveBeenCalled();
  });
});
