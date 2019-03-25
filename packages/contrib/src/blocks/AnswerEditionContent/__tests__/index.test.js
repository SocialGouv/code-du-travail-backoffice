import React from "react";
import { fireEvent, render } from "react-testing-library";

import AnswerEditionContent from "..";

describe("[Contrib] blocks/<AnswerEditionContent />", () => {
  const onChange = jest.fn();
  const onToggleTag = jest.fn();

  const props = {
    defaultValue: "Hello World!",
    onChange,
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

  const { asFragment, container, getByText, queryByText } = render(
    <AnswerEditionContent {...props} />
  );
  const firstRender = asFragment();

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
    expect(queryByText("A Tag")).not.toBeInTheDocument();
    expect(queryByText("Another Tag")).not.toBeInTheDocument();
  });

  it("should show the <TagsBar />", () => {
    fireEvent.click(getByText(/Étiquettes/));
    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(queryByText("A Tag")).toBeInTheDocument();
    expect(queryByText("Another Tag")).toBeInTheDocument();
  });

  it("should hide the <TagsBar />", () => {
    fireEvent.click(getByText(/Étiquettes/));
    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(queryByText("A Tag")).not.toBeInTheDocument();
    expect(queryByText("Another Tag")).not.toBeInTheDocument();
  });
});
