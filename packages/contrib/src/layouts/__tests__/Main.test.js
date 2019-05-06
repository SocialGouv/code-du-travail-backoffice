import React from "react";
import { render } from "react-testing-library";

import Main from "../Main";

describe.skip("[Contrib] layouts/<Main />", () => {
  const { asFragment, container } = render(<Main />);
  const firstRender = asFragment();

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should show the loading spinner", () => {
    const { asFragment } = render(<Main isLoading />);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
  });
});
