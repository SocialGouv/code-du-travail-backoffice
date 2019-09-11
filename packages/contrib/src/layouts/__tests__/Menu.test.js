import React from "react";
import { fireEvent, render } from "@testing-library/react";

global.open = jest.fn();

import Menu from "../Menu";

import { ANSWER_STATE } from "../../constants";
import T from "../../texts";

describe.skip("[Contrib] layouts/<Menu /> (Contributor)", () => {
  const props = {
    me: { payload: { name: "John Doe" } },
    router: { pathname: "/" }
  };

  const JWT = "A Fake Token";
  const ME = JSON.stringify(props.me);

  const γ = render(<Menu {...props} />);
  const firstRender = γ.asFragment();

  it("should match snapshot", () => {
    sessionStorage.setItem("jwt", JWT);
    sessionStorage.setItem("me", ME);

    expect(sessionStorage.getItem("jwt")).toBe(JWT);
    expect(sessionStorage.getItem("me")).toBe(ME);
    expect(γ.container).toMatchSnapshot();
  });

  it("should redirect to the todo answers list", () => {
    fireEvent.click(γ.getByText(T.ANSWERS_INDEX_TITLE(ANSWER_STATE.TO_DO)));

    expect(sessionStorage.getItem("jwt")).toBe(JWT);
    expect(sessionStorage.getItem("me")).toBe(ME);
    expect(global.nextRouter.push).toHaveBeenCalledWith("/answers/todo/1");
  });

  it("should redirect to the draft answers list", () => {
    fireEvent.click(γ.getByText(T.ANSWERS_INDEX_TITLE(ANSWER_STATE.DRAFT)));

    expect(sessionStorage.getItem("jwt")).toBe(JWT);
    expect(sessionStorage.getItem("me")).toBe(ME);
    expect(global.nextRouter.push).toHaveBeenCalledWith("/answers/draft/1");
  });

  it("should redirect to the under review answers list", () => {
    fireEvent.click(
      γ.getByText(T.ANSWERS_INDEX_TITLE(ANSWER_STATE.UNDER_REVIEW))
    );

    expect(sessionStorage.getItem("jwt")).toBe(JWT);
    expect(sessionStorage.getItem("me")).toBe(ME);
    expect(global.nextRouter.push).toHaveBeenCalledWith(
      "/answers/under_review/1"
    );
  });

  it("should redirect to the validated answers list", () => {
    fireEvent.click(γ.getByText(T.ANSWERS_INDEX_TITLE(ANSWER_STATE.VALIDATED)));

    expect(sessionStorage.getItem("jwt")).toBe(JWT);
    expect(sessionStorage.getItem("me")).toBe(ME);
    expect(global.nextRouter.push).toHaveBeenCalledWith("/answers/validated/1");
  });

  it("should open the contribution guide URL", () => {
    fireEvent.click(γ.getByText("Guide : Outil de contribution"));

    expect(sessionStorage.getItem("jwt")).toBe(JWT);
    expect(sessionStorage.getItem("me")).toBe(ME);
    expect(global.open).toHaveBeenCalledWith(
      "https://jean-rene-duscher.gitbook.io/code-du-travail-numerique/",
      "_blank"
    );
  });

  it("should open the local metalworking agreement proposal", () => {
    fireEvent.click(
      γ.getByText("Proposition de réponses-types CC métallurgie locales")
    );

    expect(sessionStorage.getItem("jwt")).toBe(JWT);
    expect(sessionStorage.getItem("me")).toBe(ME);
    expect(global.open).toHaveBeenCalledWith(
      "https://jean-rene-duscher.gitbook.io/code-du-travail-numerique/",
      "_blank"
    );
  });

  it("should redirect to the charter path", () => {
    fireEvent.click(γ.getByText("Charte rédactionnelle"));

    expect(sessionStorage.getItem("jwt")).toBe(JWT);
    expect(sessionStorage.getItem("me")).toBe(ME);
    expect(global.nextRouter.push).toHaveBeenCalledWith("/charter");
  });

  it("should empty session and redirect to login path", () => {
    fireEvent.click(γ.getAllByText("Se déconnecter")[0]);

    expect(sessionStorage.getItem("jwt")).toBe(null);
    expect(sessionStorage.getItem("me")).toBe(null);
    expect(global.nextRouter.push).toHaveBeenCalledWith("/login");
  });

  it("should match snapshot diff when the path has changed", () => {
    const newProps = {
      ...props,
      router: { pathname: "/chart" }
    };

    const { asFragment } = render(<Menu {...newProps} />);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
  });
});

describe.skip("[Contrib] layouts/<Menu /> (Admin)", () => {
  const props = {
    isAdmin: true,
    me: { payload: { name: "John Doe" } },
    router: { pathname: "/" }
  };

  const JWT = "A Fake Token";
  const ME = JSON.stringify(props.me);

  const γ = render(<Menu {...props} />);

  it("should match snapshot", () => {
    sessionStorage.setItem("jwt", JWT);
    sessionStorage.setItem("me", ME);

    expect(sessionStorage.getItem("jwt")).toBe(JWT);
    expect(sessionStorage.getItem("me")).toBe(ME);
    expect(γ.container).toMatchSnapshot();
  });

  it("should empty session and redirect to login path", () => {
    fireEvent.click(γ.getAllByText("Se déconnecter")[1]);

    expect(sessionStorage.getItem("jwt")).toBe(null);
    expect(sessionStorage.getItem("me")).toBe(null);
    expect(global.nextRouter.push).toHaveBeenCalledWith("/login");
  });
});
