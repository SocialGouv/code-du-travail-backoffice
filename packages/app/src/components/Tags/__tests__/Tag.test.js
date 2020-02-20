import { cleanup, fireEvent, render } from "@testing-library/react";
import React from "react";

import Tag from "../Tag";

global.open = jest.fn();

describe.skip("components/Tags/<Tag />", () => {
  const props = {
    ariaName: "le tag",
    id: "da68fa2d-4bfc-4b5b-bea3-f39f44719650",
    onRemove: jest.fn(),
    url: "https://example.com",
    value: "A Tag"
  };

  const γ = render(<Tag {...props} />);

  it("should match snapshot", () => {
    expect(γ.container).toMatchSnapshot();

    expect(γ.queryByText(props.value)).toBeInTheDocument();
    expect(
      γ.queryByAltText(`Bouton supprimant ${props.ariaName} ${props.value}`)
    ).toBeInTheDocument();
    expect(
      γ.queryByAltText(`Bouton ouvrant l'url de ${props.ariaName} ${props.value}`)
    ).toBeInTheDocument();
  });

  it("should trigger onRemove() with the expected param", () => {
    fireEvent.click(γ.getByAltText(`Bouton supprimant ${props.ariaName} ${props.value}`));

    expect(props.onRemove).toHaveBeenCalledWith(props.value);
  });

  it("should trigger window.open() with the expected param", () => {
    fireEvent.click(γ.getByAltText(`Bouton ouvrant l'url de ${props.ariaName} ${props.value}`));

    expect(global.open).toHaveBeenCalledWith(props.url, "_blank");
  });

  it("should match snapshot with an undefined `ariaName` prop", () => {
    cleanup();

    const newProps = { ...props, ariaName: undefined };

    const γ = render(<Tag {...newProps} />);

    expect(γ.queryByText(props.value)).toBeInTheDocument();
    expect(γ.queryByAltText(`Bouton supprimant l'étiquette ${props.value}`)).toBeInTheDocument();
    expect(
      γ.queryByAltText(`Bouton ouvrant l'url de l'étiquette ${props.value}`)
    ).toBeInTheDocument();
  });
});
