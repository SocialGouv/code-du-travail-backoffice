import React from "react";
import { render } from "react-testing-library";
import Icon from "../Icon";

describe("[Contrib] elements/<Icon />", () => {
  const props = {
    icon: "book"
  };

  const { asFragment, container } = render(<Icon {...props} />);
  const firstRender = asFragment();

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with `color` prop", () => {
    const { asFragment } = render(<Icon {...props} color="red" />);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
  });

  it("should match snapshot with a custom `isSmall` prop", () => {
    const { asFragment } = render(<Icon {...props} isSmall />);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
  });

  it("should match snapshot with a dashed icon name", () => {
    const { container } = render(<Icon icon="caret-down" />);

    expect(container).toMatchSnapshot();
  });
});
