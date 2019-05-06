import React from "react";
import { fireEvent, render } from "react-testing-library";

import Tag from "../Tag";

global.open = jest.fn();

describe.skip("[Contrib] components/Tags/<Tag />", () => {
  const props = {
    ariaName: "le tag",
    id: "da68fa2d-4bfc-4b5b-bea3-f39f44719650",
    onRemove: jest.fn(),
    url: "https://example.com",
    value: "A Tag"
  };

  const { container, getByAltText, queryByAltText, queryByText } = render(
    <Tag {...props} />
  );

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
    expect(queryByText(props.value)).toBeInTheDocument();
    expect(
      queryByAltText(`Bouton supprimant ${props.ariaName} ${props.value}`)
    ).toBeInTheDocument();
    expect(
      queryByAltText(`Bouton ouvrant l'url de ${props.ariaName} ${props.value}`)
    ).toBeInTheDocument();
  });

  it("should trigger onRemove() with the expected param", () => {
    fireEvent.click(
      getByAltText(`Bouton supprimant ${props.ariaName} ${props.value}`)
    );

    expect(props.onRemove).toHaveBeenCalledWith(props.value);
  });

  it("should trigger window.open() with the expected param", () => {
    fireEvent.click(
      getByAltText(`Bouton ouvrant l'url de ${props.ariaName} ${props.value}`)
    );

    expect(global.open).toHaveBeenCalledWith(props.url, "_blank");
  });

  it("should match snapshot with an undefined `ariaName` prop", () => {
    const newProps = { ...props, ariaName: undefined };

    const { container, queryByText } = render(<Tag {...newProps} />);

    expect(container).toMatchSnapshot();
    expect(queryByText(props.value)).toBeInTheDocument();
    expect(
      queryByAltText(`Bouton supprimant l'étiquette ${props.value}`)
    ).toBeInTheDocument();
    expect(
      queryByAltText(`Bouton ouvrant l'url de l'étiquette ${props.value}`)
    ).toBeInTheDocument();
  });
});
