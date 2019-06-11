import React from "react";
import { fireEvent, render } from "@testing-library/react";

import Tab from "../Tab";

describe("[Contrib] blocks/AnswerEditionHead/<Tab />", () => {
  const props = {
    children: "A Tab Text",
    icon: "book",
    isActive: false,
    onClick: jest.fn()
  };

  const { asFragment, container, getByText } = render(<Tab {...props} />);
  const firstRender = asFragment();

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should trigger onClick() with the expected param", () => {
    fireEvent.click(getByText(props.children));

    expect(props.onClick).toHaveBeenCalled();
  });

  it("should match snapshot diff with `isActive` prop", () => {
    const { asFragment } = render(<Tab {...props} isActive />);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
  });
});
