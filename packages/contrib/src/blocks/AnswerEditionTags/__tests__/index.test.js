import React from "react";
import { fireEvent, render } from "@testing-library/react";

import AnswerEditionTags from "..";

describe("[Contrib] blocks/<AnswerEditionTags />", () => {
  const props = {
    onToggle: jest.fn(),
    selectedTags: ["da68fa2d-4bfc-4b5b-bea3-f39f44719650"],
    tags: [
      {
        id: "da68fa2d-4bfc-4b5b-bea3-f39f44719650",
        value: "A Tag",
        category: "contract_type"
      },
      {
        id: "d7d54d79-b389-416c-9e06-43eb36a5ab30",
        value: "Another Tag",
        category: "target"
      }
    ]
  };

  const { container, getByText } = render(<AnswerEditionTags {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should trigger onToggle() with the expected param (on)", () => {
    fireEvent.click(getByText("Another Tag"));

    expect(props.onToggle).toHaveBeenCalledWith(props.tags[1].id, true);
  });

  it("should trigger onToggle() with the expected param (off)", () => {
    fireEvent.click(getByText("Another Tag"));

    expect(props.onToggle).toHaveBeenCalledWith(props.tags[1].id, false);
  });
});
