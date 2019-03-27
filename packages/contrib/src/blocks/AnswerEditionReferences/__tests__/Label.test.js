import React from "react";
import { fireEvent, render } from "react-testing-library";

global.open = jest.fn();

import Label from "../Label";

describe("[Contrib] blocks/AnswerEditionReferences/<Label />", () => {
  const onRemove = jest.fn();

  const props = {
    onRemove,
    url: "https://example.com",
    value: "A Label"
  };

  const { container, getByAltText } = render(<Label {...props} />);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should open the url with the expected params", () => {
    fireEvent.click(
      getByAltText(/Bouton ouvrant l'url de la référence juridique A Label/)
    );

    expect(window.open).toHaveBeenCalledWith(props.url, "_blank");
  });

  it("should trigger onRemove() with the expected param", () => {
    fireEvent.click(
      getByAltText(/Bouton supprimant la référence juridique A Label/)
    );

    expect(onRemove).toHaveBeenCalledWith(props.value);
  });
});
