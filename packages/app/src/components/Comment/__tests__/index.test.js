import React from "react";
import { create } from "react-test-renderer";

import Comment from "..";
import runTestRenderedProperty from "../../../../tests/utils/runTestRenderedProperty";

describe("components/<Comment />", () => {
  const PROPS = {
    isMe: false,
    isPrivate: false,
    onRemove: jest.fn(),
    value: `A value`,
  };

  it(`should render a left bubble when it's someone else's comment`, async () => {
    const props = {
      ...PROPS,
    };

    const $comment = create(<Comment {...props} />);

    expect($comment).toHaveTestRenderedTextContent(props.value, "left-bubble");
  });

  it(`should render a right bubble when it's my comment`, async () => {
    const props = {
      ...PROPS,
      isMe: true,
    };

    const $comment = create(<Comment {...props} />);

    expect($comment).toHaveTestRenderedTextContent(props.value, "right-bubble");
  });

  it(`should be styled as expected when it's someone else's comment`, async () => {
    const props = {
      ...PROPS,
    };

    const $comment = create(<Comment {...props} />);

    expect($comment).toHaveTestRenderedStyleRule("background", "white", {}, "left-bubble");
    expect($comment).toHaveTestRenderedStyleRule(
      "border",
      "2px solid var(--color-light-steel-blue)",
      {},
      "left-bubble",
    );
    expect($comment).toHaveTestRenderedStyleRule(
      "border-top",
      "0.5rem solid var(--color-light-steel-blue)",
      { target: ":before" },
      "left-bubble",
    );
    expect($comment).toHaveTestRenderedStyleRule(
      "border-right",
      "0.5rem solid var(--color-light-steel-blue)",
      { target: ":before" },
      "left-bubble",
    );
  });

  it(`should be styled as expected when it's my comment`, async () => {
    const props = {
      ...PROPS,
      isMe: true,
    };

    const $comment = create(<Comment {...props} />);

    expect($comment).toHaveTestRenderedStyleRule("background", "white", {}, "right-bubble");
    expect($comment).toHaveTestRenderedStyleRule(
      "border",
      "2px solid var(--color-light-steel-blue)",
      {},
      "right-bubble",
    );
    expect($comment).toHaveTestRenderedStyleRule(
      "border-top",
      "0.5rem solid var(--color-light-steel-blue)",
      { target: ":before" },
      "right-bubble",
    );
    expect($comment).toHaveTestRenderedStyleRule(
      "border-left",
      "0.5rem solid var(--color-light-steel-blue)",
      { target: ":before" },
      "right-bubble",
    );
  });

  it(`should be styled as expected when it's someone else's private comment`, async () => {
    const props = {
      ...PROPS,
      isPrivate: true,
    };

    const $comment = create(<Comment {...props} />);

    expect($comment).toHaveTestRenderedStyleRule(
      "background",
      "repeating-linear-gradient(45deg,#f4f4f4,#f4f4f4 10px,#ffffff 10px,#ffffff 20px)",
      {},
      "left-bubble",
    );
    expect($comment).toHaveTestRenderedStyleRule(
      "border",
      "2px solid var(--color-mummy-tomb)",
      {},
      "left-bubble",
    );
    expect($comment).toHaveTestRenderedStyleRule(
      "border-top",
      "0.5rem solid var(--color-mummy-tomb)",
      { target: ":before" },
      "left-bubble",
    );
    expect($comment).toHaveTestRenderedStyleRule(
      "border-right",
      "0.5rem solid var(--color-mummy-tomb)",
      { target: ":before" },
      "left-bubble",
    );
  });

  it(`should be styled as expected when it's my private comment`, async () => {
    const props = {
      ...PROPS,
      isMe: true,
      isPrivate: true,
    };

    const $comment = create(<Comment {...props} />);

    expect($comment).toHaveTestRenderedStyleRule(
      "background",
      "repeating-linear-gradient(45deg,#f4f4f4,#f4f4f4 10px,#ffffff 10px,#ffffff 20px)",
      {},
      "right-bubble",
    );
    expect($comment).toHaveTestRenderedStyleRule(
      "border",
      "2px solid var(--color-mummy-tomb)",
      {},
      "right-bubble",
    );
    expect($comment).toHaveTestRenderedStyleRule(
      "border-top",
      "0.5rem solid var(--color-mummy-tomb)",
      { target: ":before" },
      "right-bubble",
    );
    expect($comment).toHaveTestRenderedStyleRule(
      "border-left",
      "0.5rem solid var(--color-mummy-tomb)",
      { target: ":before" },
      "right-bubble",
    );
  });

  it(`should call {onRemove} when clicking on removal button`, async () => {
    const props = {
      ...PROPS,
      isMe: true,
    };

    const $comment = create(<Comment {...props} />);

    runTestRenderedProperty($comment, "onClick", "button-remove");

    expect(props.onRemove).toHaveBeenNthCalledWith(1);
  });
});
