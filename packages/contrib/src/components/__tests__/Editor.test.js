import React from "react";
import { render } from "react-testing-library";

import Editor from "../Editor";

describe("<Editor />", () => {
  const props = {
    defaultValue: `
## Guerre et Paix

### Citation

> Il m'est arrivé de sentir que tout allait bien pour moi, que tout le<br>
> monde était gai, et aussitôt l'idée me traversait l'esprit qu'il ne se<br>
> passerait plus rien et que tout était absurde.

*Léon Tolstoï*

Ceci est <u>important</u>.

Ceci est très **important**.
    `,
    label: "A label",
    onChange: jest.fn(),
    onTagsClicked: jest.fn()
  };

  const { container } = render(<Editor {...props} />);

  it("should match snapshot", () => {
    // We need to disable this attribute since it's automatically generated and
    // we can't have any control over it:
    // eslint-disable-next-line prettier/prettier
    container.innerHTML = container.innerHTML
      .replace(/ medium-editor-index="[^"]{36}"/, "");

    expect(container).toMatchSnapshot();
  });
});
