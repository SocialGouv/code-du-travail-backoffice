import React from "react";
import { create } from "react-test-renderer";

jest.mock("js-cookie");
jest.mock("next/router");

import jsCookie from "js-cookie";
import Router from "next/router";

jest.mock("../../../cache");

import Menu from "..";
import runTestRenderedProperty from "../../../../tests/utils/runTestRenderedProperty";
import cache from "../../../cache";

describe("layouts/<Menu />", () => {
  beforeAll(() => {
    window.open = jest.fn();
  });

  describe("when the user is a contributor", () => {
    beforeAll(() => {
      cache.get.mockReturnValue({
        data: {
          name: "Nemo The Contributor",
        },
        isAdmin: false,
      });
    });

    it(`should render as expected`, () => {
      const $menu = create(<Menu />);

      expect($menu).toHaveTestRenderedChild("contrib-answers-todo");
      expect($menu).toHaveTestRenderedChild("contrib-answers-draft");
      expect($menu).toHaveTestRenderedChild("contrib-answers-under-review");
      expect($menu).toHaveTestRenderedChild("contrib-answers-validated");
      expect($menu).toHaveTestRenderedChild("contrib-guide");
      expect($menu).toHaveTestRenderedChild("contrib-charter");
      expect($menu).toHaveTestRenderedChild("contrib-proposal");
      expect($menu).toHaveTestRenderedChild("contrib-reformulation");
      expect($menu).toHaveTestRenderedChild("contrib-feedback");
      expect($menu).toHaveTestRenderedChild("contrib-logout");
    });

    it(`should behave as expected`, () => {
      const $menu = create(<Menu />);

      runTestRenderedProperty($menu, "onClick", "contrib-answers-todo");
      runTestRenderedProperty($menu, "onKeyPress", "contrib-answers-todo");
      runTestRenderedProperty($menu, "onClick", "contrib-answers-draft");
      runTestRenderedProperty($menu, "onKeyPress", "contrib-answers-draft");
      runTestRenderedProperty($menu, "onClick", "contrib-answers-under-review");
      runTestRenderedProperty($menu, "onKeyPress", "contrib-answers-under-review");
      runTestRenderedProperty($menu, "onClick", "contrib-answers-validated");
      runTestRenderedProperty($menu, "onKeyPress", "contrib-answers-validated");
      runTestRenderedProperty($menu, "onClick", "contrib-guide");
      runTestRenderedProperty($menu, "onKeyPress", "contrib-guide");
      runTestRenderedProperty($menu, "onClick", "contrib-charter");
      runTestRenderedProperty($menu, "onKeyPress", "contrib-charter");
      runTestRenderedProperty($menu, "onClick", "contrib-proposal");
      runTestRenderedProperty($menu, "onKeyPress", "contrib-proposal");
      runTestRenderedProperty($menu, "onClick", "contrib-reformulation");
      runTestRenderedProperty($menu, "onKeyPress", "contrib-reformulation");
      runTestRenderedProperty($menu, "onClick", "contrib-feedback");
      runTestRenderedProperty($menu, "onKeyPress", "contrib-feedback");
      runTestRenderedProperty($menu, "onClick", "contrib-logout");
      runTestRenderedProperty($menu, "onKeyPress", "contrib-logout");

      expect(Router.push).toHaveBeenCalledTimes(10);
      expect(window.open).toHaveBeenCalledTimes(8);
      expect(jsCookie.remove).toHaveBeenCalledTimes(2);

      expect(Router.push).toHaveBeenNthCalledWith(1, "/answers/todo/1");
      expect(Router.push).toHaveBeenNthCalledWith(2, "/answers/todo/1");
      expect(Router.push).toHaveBeenNthCalledWith(3, "/answers/draft/1");
      expect(Router.push).toHaveBeenNthCalledWith(4, "/answers/draft/1");
      expect(Router.push).toHaveBeenNthCalledWith(5, "/answers/under_review/1");
      expect(Router.push).toHaveBeenNthCalledWith(6, "/answers/under_review/1");
      expect(Router.push).toHaveBeenNthCalledWith(7, "/answers/validated/1");
      expect(Router.push).toHaveBeenNthCalledWith(8, "/answers/validated/1");

      expect(window.open).toHaveBeenNthCalledWith(
        1,
        "https://jean-rene-duscher.gitbook.io/code-du-travail-numerique/",
        "_blank",
      );
      expect(window.open).toHaveBeenNthCalledWith(
        2,
        "https://jean-rene-duscher.gitbook.io/code-du-travail-numerique/",
        "_blank",
      );

      expect(Router.push).toHaveBeenNthCalledWith(9, "/charter");
      expect(Router.push).toHaveBeenNthCalledWith(10, "/charter");

      expect(window.open).toHaveBeenNthCalledWith(
        3,
        "/static/docs/Proposition-de-reponse-types-CC-metallurgie-locales.docx",
        "_blank",
      );
      expect(window.open).toHaveBeenNthCalledWith(
        4,
        "/static/docs/Proposition-de-reponse-types-CC-metallurgie-locales.docx",
        "_blank",
      );

      expect(window.open).toHaveBeenNthCalledWith(
        5,
        "/static/docs/Reformulation-des-intitules-de-question.xlsx",
        "_blank",
      );
      expect(window.open).toHaveBeenNthCalledWith(
        6,
        "/static/docs/Reformulation-des-intitules-de-question.xlsx",
        "_blank",
      );

      expect(window.open).toHaveBeenNthCalledWith(
        7,
        "/static/docs/Premiers-retours-sur-la-validation-des-contributions.docx",
        "_blank",
      );
      expect(window.open).toHaveBeenNthCalledWith(
        8,
        "/static/docs/Premiers-retours-sur-la-validation-des-contributions.docx",
        "_blank",
      );

      expect(jsCookie.remove).toHaveBeenNthCalledWith(1, "jwt");
      expect(jsCookie.remove).toHaveBeenNthCalledWith(2, "jwt");
    });
  });

  describe("when the user is an administrator", () => {
    beforeAll(() => {
      cache.get.mockReturnValue({
        data: {
          name: "Doris The Administrator",
        },
        isAdmin: true,
      });
    });

    it(`should render as expected`, () => {
      const $menu = create(<Menu />);

      expect($menu).toHaveTestRenderedChild("admin-logout");
    });

    it(`should behave as expected`, () => {
      const $menu = create(<Menu />);

      runTestRenderedProperty($menu, "onClick", "admin-logout");
      runTestRenderedProperty($menu, "onKeyPress", "admin-logout");

      expect(jsCookie.remove).toHaveBeenCalledTimes(2);
      expect(jsCookie.remove).toHaveBeenNthCalledWith(1, "jwt");
      expect(jsCookie.remove).toHaveBeenNthCalledWith(2, "jwt");
    });
  });
});
