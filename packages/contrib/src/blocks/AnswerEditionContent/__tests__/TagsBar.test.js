import React from "react";
import { fireEvent, render } from "react-testing-library";

import TagsBar from "../TagsBar";

describe("[Contrib] blocks/AnswerEditionContent/<TagsBar />", () => {
  const onToggleTag = jest.fn();

  const props = {
    onToggleTag,
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

  const { container, getByText } = render(<TagsBar {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should trigger onToggleTag() with the expected param", () => {
    fireEvent.click(getByText(/Another Tag/));
    expect(onToggleTag).toHaveBeenCalledWith(props.tags[1].id, true);
  });

  it("should trigger onToggleTag() with the expected param", () => {
    fireEvent.click(getByText(/Another Tag/));
    expect(onToggleTag).toHaveBeenCalledWith(props.tags[1].id, false);
  });
});
