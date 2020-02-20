import { fireEvent, render } from "@testing-library/react";
import React from "react";

import AnswerEditionTagsBlock from "..";

describe.skip("blocks/<AnswerEditionTags />", () => {
  const props = {
    onToggle: jest.fn(),
    selectedTags: ["da68fa2d-4bfc-4b5b-bea3-f39f44719650"],
    tags: [
      {
        category: "contract_type",
        id: "da68fa2d-4bfc-4b5b-bea3-f39f44719650",
        value: "A Tag"
      },
      {
        category: "target",
        id: "d7d54d79-b389-416c-9e06-43eb36a5ab30",
        value: "Another Tag"
      }
    ]
  };

  const { container, getByText } = render(<AnswerEditionTagsBlock {...props} />);

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
