import React from "react";
import { fireEvent, render } from "@testing-library/react";

import Tabs, { TABS } from "../Tabs";

describe.skip("[Contrib] blocks/AnswerEditionHead/<Tabs />", () => {
  const props = {
    currentTab: TABS.EDITOR,
    onChange: jest.fn(),
    referencesCount: 2,
    tagsCount: 12
  };

  const { container, getByText } = render(<Tabs {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should trigger onChange() with the expected param (0)", () => {
    fireEvent.click(getByText("Édition"));

    expect(props.onChange).toHaveBeenCalledWith(TABS.EDITOR);
  });

  it("should trigger onChange() with the expected param (1)", () => {
    fireEvent.click(getByText(/Références juridiques \(\d+\)/));

    expect(props.onChange).toHaveBeenCalledWith(TABS.REFERENCES);
  });

  it("should trigger onChange() with the expected param (2)", () => {
    fireEvent.click(getByText(/Étiquettes \(\d+\)/));

    expect(props.onChange).toHaveBeenCalledWith(TABS.TAGS);
  });
});
