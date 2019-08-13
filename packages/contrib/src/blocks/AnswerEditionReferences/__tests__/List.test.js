import React from "react";
import { fireEvent, render } from "@testing-library/react";

import "../../../../__mocks__/waitFor";

global.open = jest.fn();

import List from "../List";

describe.skip("[Contrib] blocks/AnswerEditionReferences/<List />", () => {
  const props = {
    ariaName: "A Reference Type",
    onRemove: jest.fn(),
    references: [
      {
        category: "labor_code",
        url: null,
        value: "L1234-5"
      },
      {
        category: null,
        url: "https://example.com",
        value: "An Uncategorized Reference"
      },
      {
        category: "agreement",
        url: null,
        value: "An Agreement Reference"
      }
    ]
  };

  const γ = render(<List {...props} />);

  it("should match snapshot", () => {
    expect(γ.container).toMatchSnapshot();
    expect(γ.queryByText(props.references[0].value)).toBeInTheDocument();
    expect(γ.queryByText(props.references[1].value)).toBeInTheDocument();
    expect(γ.queryByText(props.references[2].value)).toBeInTheDocument();
  });

  it("should call `onRemove()` prop with the expected param", async () => {
    fireEvent.click(
      γ.getByTitle(
        `Bouton supprimant ${props.ariaName} "${props.references[0].value}"`
      )
    );

    expect(props.onRemove).toHaveBeenCalledWith(props.references[0].value);
  });

  it("should call `window.open()` with the expected params", async () => {
    fireEvent.click(
      γ.getByTitle(
        `Bouton ouvrant le lien associé à ${props.ariaName} ` +
          `"${props.references[1].value}"`
      )
    );

    expect(global.open).toHaveBeenCalledWith(props.references[1].url, "_blank");
  });
});
