import React from "react";
import { render } from "react-testing-library";
import Button from "../Button";

describe("[Contrib] elements/<Button />", () => {
  it("should match snapshot", () => {
    const { container } = render(<Button />);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with a custom `color` prop", () => {
    const { container } = render(<Button color="secondary" />);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with `hasGroup` prop", () => {
    const { container } = render(<Button hasGroup />);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with a set `icon` prop", () => {
    const { container } = render(<Button icon="sync" />);

    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with `disabled` prop", () => {
    const { container } = render(<Button disabled />);

    expect(container).toMatchSnapshot();
  });
});
