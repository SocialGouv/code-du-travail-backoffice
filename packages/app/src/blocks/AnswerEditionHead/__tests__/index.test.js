import { render } from "@testing-library/react";
import React from "react";

jest.mock("../../../elements/Idcc", () => () => null);

import AnswerEditionHeadBlock from "..";
import { TABS } from "../Tabs";

describe("blocks/<AnswerEditionHead />", () => {
  const onTabChange = jest.fn();

  const props = {
    agreement: {
      idcc: "0123",
      name: "An Agreement Name",
    },
    currentTab: TABS.EDITOR,
    onTabChange,
    question: {
      index: 123,
      value: "A Question Value",
    },
  };

  const { container } = render(<AnswerEditionHeadBlock {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });
});
