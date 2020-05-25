import React from "react";
import { create } from "react-test-renderer";

jest.mock("next/router");

import Router from "next/router";

jest.mock("../../Menu");
jest.mock("../../../cache");

import Header from "..";
import runTestRenderedProperty from "../../../../tests/utils/runTestRenderedProperty";
import cache from "../../../cache";
import Menu from "../../Menu";

describe("layouts/<Header />", () => {
  describe("when the user is not authenticated", () => {
    beforeAll(() => {
      cache.get.mockReturnValue({ isAuthenticated: false });
    });

    it(`should render as expected`, () => {
      create(<Header />);

      expect(Menu).not.toHaveBeenCalled();
    });
  });

  describe("when the user is authenticated", () => {
    beforeAll(() => {
      cache.get.mockReturnValue({ isAuthenticated: true });
    });

    it(`should render as expected`, () => {
      create(<Header />);

      expect(Menu).toHaveBeenCalledTimes(1);
    });

    describe("when the user is a contributor", () => {
      beforeAll(() => {
        cache.get.mockReturnValue({ isAdmin: false, isAuthenticated: true });
      });

      it(`should behave as expected`, () => {
        const $header = create(<Header />);

        runTestRenderedProperty($header, "onClick", "brand");
        runTestRenderedProperty($header, "onKeyUp", "brand");

        expect(Router.push).toHaveBeenCalledTimes(2);
        expect(Router.push).toHaveBeenNthCalledWith(1, "/");
        expect(Router.push).toHaveBeenNthCalledWith(2, "/");
      });
    });

    describe("when the user is an administrator", () => {
      beforeAll(() => {
        cache.get.mockReturnValue({ isAdmin: true, isAuthenticated: true });
      });

      it(`should behave as expected`, () => {
        const $header = create(<Header />);

        runTestRenderedProperty($header, "onClick", "brand");
        runTestRenderedProperty($header, "onKeyUp", "brand");

        expect(Router.push).toHaveBeenCalledTimes(2);
        expect(Router.push).toHaveBeenNthCalledWith(1, "/admin");
        expect(Router.push).toHaveBeenNthCalledWith(2, "/admin");
      });
    });
  });
});
