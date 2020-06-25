import React from "react";
import { create } from "react-test-renderer";

jest.mock("next/router");

import Router from "next/router";

jest.mock("../../../cache");
jest.mock("../../../helpers/isNode");

import { AdminMenu } from "..";
import runTestRenderedProperty from "../../../../tests/utils/runTestRenderedProperty";
import cache from "../../../cache";
import isNode from "../../../helpers/isNode";

describe("layouts/<AdminMenu />", () => {
  const PROPS = {
    router: {
      pathname: "/",
    },
  };

  beforeAll(() => {
    isNode.mockReturnValue(false);
  });

  describe("when the user is not authenticated", () => {
    it(`should render as expected`, () => {
      cache.get.mockReturnValueOnce(null);
      const $adminMenu = create(<AdminMenu {...PROPS} />);

      expect($adminMenu).toHaveTestRenderedChildLength(0);
    });
  });

  describe("when the user is a regional administrator", () => {
    beforeAll(() => {
      cache.get.mockReturnValue({ role: "regional_administrator" });
    });

    it(`should render as expected`, () => {
      PROPS.router.pathname = "/admin";
      const $adminMenu = create(<AdminMenu {...PROPS} />);

      expect($adminMenu).toHaveTestRenderedChildLength(1);
      expect($adminMenu).toHaveTestRenderedChild("regional-admin-dashboard");
      expect($adminMenu).toHaveTestRenderedProperty("isActive", true, "regional-admin-dashboard");
      expect($adminMenu).toHaveTestRenderedStyleRule(
        "background-color",
        "black",
        {},
        "regional-admin-dashboard",
      );
      expect($adminMenu).toHaveTestRenderedStyleRule(
        "background-color",
        "black",
        { target: ":hover" },
        "regional-admin-dashboard",
      );
    });

    it(`should behave as expected`, () => {
      const $adminMenu = create(<AdminMenu {...PROPS} />);

      runTestRenderedProperty($adminMenu, "onClick", "regional-admin-dashboard");
      runTestRenderedProperty($adminMenu, "onKeyPress", "regional-admin-dashboard");

      expect(Router.push).toHaveBeenCalledTimes(2);
      expect(Router.push).toHaveBeenNthCalledWith(1, "/admin");
      expect(Router.push).toHaveBeenNthCalledWith(2, "/admin");
    });
  });

  describe("when the user is an administrator", () => {
    beforeAll(() => {
      cache.get.mockReturnValue({ role: "administrator" });
    });

    it(`should render as expected`, () => {
      const $adminMenu = create(<AdminMenu {...PROPS} />);

      expect($adminMenu).toHaveTestRenderedChildLength(11);
      expect($adminMenu).toHaveTestRenderedChild("admin-dashboard");
      expect($adminMenu).toHaveTestRenderedChild("admin-agreements");
      expect($adminMenu).toHaveTestRenderedChild("admin-questions");
      expect($adminMenu).toHaveTestRenderedChild("admin-answers-references");
      expect($adminMenu).toHaveTestRenderedChild("admin-answers");
      expect($adminMenu).toHaveTestRenderedChild("admin-generic-answers");
      expect($adminMenu).toHaveTestRenderedChild("admin-locations");
      expect($adminMenu).toHaveTestRenderedChild("admin-users");
      expect($adminMenu).toHaveTestRenderedChild("admin-logs");
      expect($adminMenu).toHaveTestRenderedChild("admin-migrations");
    });

    describe(`when path is "/admin"`, () => {
      beforeAll(() => {
        PROPS.router.pathname = "/admin";
      });

      it(`should render as expected`, () => {
        const $adminMenu = create(<AdminMenu {...PROPS} />);

        expect($adminMenu).toHaveTestRenderedProperty("isActive", true, "admin-dashboard");
        expect($adminMenu).toHaveTestRenderedProperty("isActive", false, "admin-answers");
        expect($adminMenu).toHaveTestRenderedStyleRule(
          "background-color",
          "black",
          {},
          "admin-dashboard",
        );
        expect($adminMenu).toHaveTestRenderedStyleRule(
          "background-color",
          "black",
          { target: ":hover" },
          "admin-dashboard",
        );
        expect($adminMenu).toHaveTestRenderedStyleRule(
          "background-color",
          "transparent",
          {},
          "admin-answers",
        );
        expect($adminMenu).toHaveTestRenderedStyleRule(
          "background-color",
          "var(--color-japenese-indigo)",
          { target: ":hover" },
          "admin-answers",
        );
      });
    });

    describe(`when path is "/admin/answers"`, () => {
      beforeAll(() => {
        PROPS.router.pathname = "/admin/answers";
      });

      it(`should render as expected`, () => {
        const $adminMenu = create(<AdminMenu {...PROPS} />);

        expect($adminMenu).toHaveTestRenderedProperty("isActive", false, "admin-dashboard");
        expect($adminMenu).toHaveTestRenderedProperty("isActive", true, "admin-answers");
      });

      describe(`when runned under node`, () => {
        beforeAll(() => {
          isNode.mockReturnValue(true);
        });

        it(`should render as expected`, () => {
          PROPS.router.pathname = "/admin/answers";
          const $adminMenu = create(<AdminMenu />);

          expect($adminMenu).toHaveTestRenderedProperty("isActive", false, "admin-dashboard");
          expect($adminMenu).toHaveTestRenderedProperty("isActive", false, "admin-answers");
        });
      });
    });

    it(`should behave as expected`, () => {
      const $adminMenu = create(<AdminMenu {...PROPS} />);

      runTestRenderedProperty($adminMenu, "onClick", "admin-dashboard");
      runTestRenderedProperty($adminMenu, "onKeyPress", "admin-dashboard");
      runTestRenderedProperty($adminMenu, "onClick", "admin-agreements");
      runTestRenderedProperty($adminMenu, "onKeyPress", "admin-agreements");
      runTestRenderedProperty($adminMenu, "onClick", "admin-questions");
      runTestRenderedProperty($adminMenu, "onKeyPress", "admin-questions");
      runTestRenderedProperty($adminMenu, "onClick", "admin-answers-references");
      runTestRenderedProperty($adminMenu, "onKeyPress", "admin-answers-references");
      runTestRenderedProperty($adminMenu, "onClick", "admin-answers");
      runTestRenderedProperty($adminMenu, "onKeyPress", "admin-answers");
      runTestRenderedProperty($adminMenu, "onClick", "admin-generic-answers");
      runTestRenderedProperty($adminMenu, "onKeyPress", "admin-generic-answers");
      runTestRenderedProperty($adminMenu, "onClick", "admin-locations");
      runTestRenderedProperty($adminMenu, "onKeyPress", "admin-locations");
      runTestRenderedProperty($adminMenu, "onClick", "admin-users");
      runTestRenderedProperty($adminMenu, "onKeyPress", "admin-users");
      runTestRenderedProperty($adminMenu, "onClick", "admin-logs");
      runTestRenderedProperty($adminMenu, "onKeyPress", "admin-logs");
      runTestRenderedProperty($adminMenu, "onClick", "admin-migrations");
      runTestRenderedProperty($adminMenu, "onKeyPress", "admin-migrations");

      expect(Router.push).toHaveBeenCalledTimes(20);
      expect(Router.push).toHaveBeenNthCalledWith(1, "/admin");
      expect(Router.push).toHaveBeenNthCalledWith(2, "/admin");
      expect(Router.push).toHaveBeenNthCalledWith(3, "/admin/agreements");
      expect(Router.push).toHaveBeenNthCalledWith(4, "/admin/agreements");
      expect(Router.push).toHaveBeenNthCalledWith(5, "/admin/questions");
      expect(Router.push).toHaveBeenNthCalledWith(6, "/admin/questions");
      expect(Router.push).toHaveBeenNthCalledWith(7, "/admin/answers-references");
      expect(Router.push).toHaveBeenNthCalledWith(8, "/admin/answers-references");
      expect(Router.push).toHaveBeenNthCalledWith(9, "/admin/answers");
      expect(Router.push).toHaveBeenNthCalledWith(10, "/admin/answers");
      expect(Router.push).toHaveBeenNthCalledWith(11, "/admin/generic-answers");
      expect(Router.push).toHaveBeenNthCalledWith(12, "/admin/generic-answers");
      expect(Router.push).toHaveBeenNthCalledWith(13, "/admin/locations");
      expect(Router.push).toHaveBeenNthCalledWith(14, "/admin/locations");
      expect(Router.push).toHaveBeenNthCalledWith(15, "/admin/users");
      expect(Router.push).toHaveBeenNthCalledWith(16, "/admin/users");
      expect(Router.push).toHaveBeenNthCalledWith(17, "/admin/logs");
      expect(Router.push).toHaveBeenNthCalledWith(18, "/admin/logs");
      expect(Router.push).toHaveBeenNthCalledWith(19, "/admin/migrations");
      expect(Router.push).toHaveBeenNthCalledWith(20, "/admin/migrations");
    });
  });
});
