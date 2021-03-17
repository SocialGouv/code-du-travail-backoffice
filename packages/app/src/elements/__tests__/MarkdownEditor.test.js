import { render } from "@testing-library/react";
import React from "react";

import MarkdownEditor from "../MarkdownEditor";

describe.skip("elements/<MarkdownEditor />", () => {
  it(`should pass`, () => {
    const $markdownEditor = render(<MarkdownEditor defaultValue="" onChange={() => undefined} />);

    expect($markdownEditor).toMatchSnapshot();
  });
});
