import { fireEvent, render } from "@testing-library/react";
import React from "react";

import AnswerEditionHeadBlockTab from "../Tab";

describe.skip("blocks/AnswerEditionHead/<Tab />", () => {
  const props = {
    children: "A Tab Text",
    icon: "book",
    isActive: false,
    onClick: jest.fn(),
  };

  const { asFragment, container, getByText } = render(<AnswerEditionHeadBlockTab {...props} />);
  const firstRender = asFragment();

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should trigger onClick() with the expected param", () => {
    fireEvent.click(getByText(props.children));

    expect(props.onClick).toHaveBeenCalled();
  });

  it("should match snapshot diff with `isActive` prop", () => {
    const { asFragment } = render(<AnswerEditionHeadBlockTab {...props} isActive />);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
  });
});
