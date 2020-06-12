import React from "react";
import { create } from "react-test-renderer";

jest.mock("../../AdminMenu", () => jest.fn(() => "AdminMenu"));
jest.mock("../../Main");

import AdminMain from "..";
import AdminMenuWithROuter from "../../AdminMenu";
import Main from "../../Main";

describe("layouts/<AdminMain />", () => {
  const PROPS = {};

  beforeAll(() => {
    Main.mockImplementation(({ children }) => <div>{children}</div>);
  });

  describe(`with {children}=undefined`, () => {
    beforeAll(() => {
      PROPS.children = undefined;
    });

    it(`should render as expected`, () => {
      create(<AdminMain {...PROPS} />);

      expect(AdminMenuWithROuter).toHaveBeenCalledTimes(1);
      expect(Main).toHaveBeenCalledTimes(1);
    });

    afterAll(() => {
      delete PROPS.children;
    });
  });

  describe(`with {isLoading}`, () => {
    beforeAll(() => {
      PROPS.isLoading = true;
    });

    it(`should render as expected`, () => {
      create(<AdminMain {...PROPS} />);

      expect(AdminMenuWithROuter).toHaveBeenCalledTimes(1);
      expect(Main).toHaveBeenCalledTimes(1);
    });

    afterAll(() => {
      delete PROPS.isLoading;
    });
  });

  describe(`with {children}=<p>An Element</p>`, () => {
    beforeAll(() => {
      PROPS.children = <p data-testid="element">An Element</p>;
    });

    it(`should render as expected`, () => {
      const $adminMain = create(<AdminMain {...PROPS} />);

      expect(AdminMenuWithROuter).toHaveBeenCalledTimes(1);
      expect(Main).toHaveBeenCalledTimes(1);
      expect($adminMain).toHaveTestRenderedProperty("noScroll", false, "content");
      expect($adminMain).toHaveTestRenderedStyleRule("overflow-y", "scroll", {}, "content");
      expect($adminMain).toHaveTestRenderedTextContent(`An Element`, "element");
    });

    describe(`with {noScroll}`, () => {
      beforeAll(() => {
        PROPS.noScroll = true;
      });

      it(`should render as expected`, () => {
        const $adminMain = create(<AdminMain {...PROPS} />);

        expect($adminMain).toHaveTestRenderedProperty("noScroll", true, "content");
        expect($adminMain).toHaveTestRenderedStyleRule("overflow-y", "hidden", {}, "content");
        expect($adminMain).toHaveTestRenderedTextContent(`An Element`, "element");
      });

      afterAll(() => {
        delete PROPS.noScroll;
      });
    });

    describe(`with {hasBareContent}`, () => {
      beforeAll(() => {
        PROPS.hasBareContent = true;
      });

      it(`should render as expected`, () => {
        const $adminMain = create(<AdminMain {...PROPS} />);

        expect($adminMain).toHaveTestRenderedTextContent(`An Element`, "element");
      });

      afterAll(() => {
        delete PROPS.hasBareContent;
      });
    });

    afterAll(() => {
      delete PROPS.children;
    });
  });
});
