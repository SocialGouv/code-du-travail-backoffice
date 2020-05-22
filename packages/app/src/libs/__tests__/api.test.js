jest.mock("isomorphic-unfetch");
jest.mock("js-cookie");

import isomorphicUnfetch from "isomorphic-unfetch";
import jsCookie from "js-cookie";

jest.mock("../../helpers/isNode");

import isNode from "../../helpers/isNode";
import api from "../api";

const PROCESS_ENV = process.env;

describe("libs/Api", () => {
  beforeAll(() => {
    jest.resetModules();

    process.env.API_URI = "https://api.uri";
    process.env.API_URI_DOCKER = "https://api.uri.docker";
    process.env.NODE_ENV = "production";
  });

  afterAll(() => {
    process.env = { ...PROCESS_ENV };
  });

  describe("#get()", () => {
    it(`should behave as expected (node, authenticated)`, async () => {
      const expected = { some: "data" };

      isomorphicUnfetch.mockResolvedValueOnce({
        json: async () => Promise.resolve(expected),
        ok: true,
      });
      isNode.mockReturnValueOnce(true);
      jsCookie.get.mockReturnValueOnce("aJwtToken");

      const received = await api.get("/a-path");

      expect(jsCookie.get).toHaveBeenNthCalledWith(1, "jwt");
      expect(isomorphicUnfetch).toHaveBeenNthCalledWith(1, "https://api.uri.docker/a-path", {
        headers: {
          Authorization: "Bearer aJwtToken",
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      expect(received).toStrictEqual(expected);
    });

    it(`should behave as expected (browser, authenticated)`, async () => {
      const expected = { some: "data" };

      isomorphicUnfetch.mockResolvedValueOnce({
        json: async () => Promise.resolve(expected),
        ok: true,
      });
      isNode.mockReturnValueOnce(false);
      jsCookie.get.mockReturnValueOnce("aJwtToken");

      const received = await api.get("/a-path");

      expect(jsCookie.get).toHaveBeenNthCalledWith(1, "jwt");
      expect(isomorphicUnfetch).toHaveBeenNthCalledWith(1, "https://api.uri/a-path", {
        headers: {
          Authorization: "Bearer aJwtToken",
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      expect(received).toStrictEqual(expected);
    });

    it(`should behave as expected (node, anonymous)`, async () => {
      const expected = { some: "data" };

      isomorphicUnfetch.mockResolvedValueOnce({
        json: async () => Promise.resolve(expected),
        ok: true,
      });
      isNode.mockReturnValueOnce(true);
      jsCookie.get.mockReturnValueOnce();

      const received = await api.get("/a-path");

      expect(jsCookie.get).toHaveBeenNthCalledWith(1, "jwt");
      expect(isomorphicUnfetch).toHaveBeenNthCalledWith(1, "https://api.uri.docker/a-path", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      expect(received).toStrictEqual(expected);
    });

    it(`should behave as expected (browser, anonymous)`, async () => {
      const expected = { some: "data" };

      isomorphicUnfetch.mockResolvedValueOnce({
        json: async () => Promise.resolve(expected),
        ok: true,
      });
      isNode.mockReturnValueOnce(false);
      jsCookie.get.mockReturnValueOnce();

      const received = await api.get("/a-path");

      expect(jsCookie.get).toHaveBeenNthCalledWith(1, "jwt");
      expect(isomorphicUnfetch).toHaveBeenNthCalledWith(1, "https://api.uri/a-path", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      expect(received).toStrictEqual(expected);
    });

    it(`should behave as expected (no content)`, async () => {
      const expected = { some: "data" };

      isomorphicUnfetch.mockResolvedValueOnce({
        json: async () => Promise.resolve(expected),
        ok: true,
        status: 204,
      });
      isNode.mockReturnValueOnce(false);
      jsCookie.get.mockReturnValueOnce("aJwtToken");

      const received = await api.get("/a-path");

      expect(jsCookie.get).toHaveBeenNthCalledWith(1, "jwt");
      expect(isomorphicUnfetch).toHaveBeenNthCalledWith(1, "https://api.uri/a-path", {
        headers: {
          Authorization: "Bearer aJwtToken",
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      expect(received).toStrictEqual({});
    });

    it(`should behave as expected (server error, with {message})`, async () => {
      const expected = { message: "An error" };

      isomorphicUnfetch.mockResolvedValueOnce({
        json: async () => Promise.resolve(expected),
        ok: false,
      });
      isNode.mockReturnValueOnce(false);
      jsCookie.get.mockReturnValueOnce("aJwtToken");

      await expect(api.get("/a-path")).rejects.toThrowError(`An error`);

      expect(jsCookie.get).toHaveBeenNthCalledWith(1, "jwt");
      expect(isomorphicUnfetch).toHaveBeenNthCalledWith(1, "https://api.uri/a-path", {
        headers: {
          Authorization: "Bearer aJwtToken",
          "Content-Type": "application/json",
        },
        method: "GET",
      });
    });

    it(`should behave as expected (server error, without {message})`, async () => {
      const expected = { some: "data" };

      isomorphicUnfetch.mockResolvedValueOnce({
        json: async () => Promise.resolve(expected),
        ok: false,
      });
      isNode.mockReturnValueOnce(false);
      jsCookie.get.mockReturnValueOnce("aJwtToken");

      await expect(api.get("/a-path")).rejects.toThrowError(
        `The server answered with an unknown error (no message).`,
      );

      expect(jsCookie.get).toHaveBeenNthCalledWith(1, "jwt");
      expect(isomorphicUnfetch).toHaveBeenNthCalledWith(1, "https://api.uri/a-path", {
        headers: {
          Authorization: "Bearer aJwtToken",
          "Content-Type": "application/json",
        },
        method: "GET",
      });
    });

    it(`should behave as expected (server error, no content)`, async () => {
      isomorphicUnfetch.mockResolvedValueOnce({
        json: async () => {
          throw new Error();
        },
        ok: false,
      });
      isNode.mockReturnValueOnce(false);
      jsCookie.get.mockReturnValueOnce("aJwtToken");

      await expect(api.get("/a-path")).rejects.toThrowError(
        `The server answered with an unknown error (no message).`,
      );

      expect(jsCookie.get).toHaveBeenNthCalledWith(1, "jwt");
      expect(isomorphicUnfetch).toHaveBeenNthCalledWith(1, "https://api.uri/a-path", {
        headers: {
          Authorization: "Bearer aJwtToken",
          "Content-Type": "application/json",
        },
        method: "GET",
      });
    });
  });

  describe("#post()", () => {
    it(`should behave as expected (node, authenticated)`, async () => {
      isomorphicUnfetch.mockResolvedValueOnce({ json: async () => Promise.resolve(), ok: true });
      isNode.mockReturnValueOnce(true);
      jsCookie.get.mockReturnValueOnce("aJwtToken");

      await api.post("/a-path", { some: "data" });

      expect(jsCookie.get).toHaveBeenNthCalledWith(1, "jwt");
      expect(isomorphicUnfetch).toHaveBeenNthCalledWith(1, "https://api.uri.docker/a-path", {
        body: `{"some":"data"}`,
        headers: {
          Authorization: "Bearer aJwtToken",
          "Content-Type": "application/json",
        },
        method: "POST",
      });
    });

    it(`should behave as expected (browser, authenticated)`, async () => {
      isomorphicUnfetch.mockResolvedValueOnce({ json: async () => Promise.resolve(), ok: true });
      isNode.mockReturnValueOnce(false);
      jsCookie.get.mockReturnValueOnce("aJwtToken");

      await api.post("/a-path", { some: "data" });

      expect(jsCookie.get).toHaveBeenNthCalledWith(1, "jwt");
      expect(isomorphicUnfetch).toHaveBeenNthCalledWith(1, "https://api.uri/a-path", {
        body: `{"some":"data"}`,
        headers: {
          Authorization: "Bearer aJwtToken",
          "Content-Type": "application/json",
        },
        method: "POST",
      });
    });
  });

  describe("#patch()", () => {
    it(`should behave as expected (node, authenticated)`, async () => {
      isomorphicUnfetch.mockResolvedValueOnce({ json: async () => Promise.resolve(), ok: true });
      isNode.mockReturnValueOnce(true);
      jsCookie.get.mockReturnValueOnce("aJwtToken");

      await api.patch("/a-path", { some: "data" });

      expect(jsCookie.get).toHaveBeenNthCalledWith(1, "jwt");
      expect(isomorphicUnfetch).toHaveBeenNthCalledWith(1, "https://api.uri.docker/a-path", {
        body: `{"some":"data"}`,
        headers: {
          Authorization: "Bearer aJwtToken",
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });
    });

    it(`should behave as expected (browser, authenticated)`, async () => {
      isomorphicUnfetch.mockResolvedValueOnce({ json: async () => Promise.resolve(), ok: true });
      isNode.mockReturnValueOnce(false);
      jsCookie.get.mockReturnValueOnce("aJwtToken");

      await api.patch("/a-path", { some: "data" });

      expect(jsCookie.get).toHaveBeenNthCalledWith(1, "jwt");
      expect(isomorphicUnfetch).toHaveBeenNthCalledWith(1, "https://api.uri/a-path", {
        body: `{"some":"data"}`,
        headers: {
          Authorization: "Bearer aJwtToken",
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });
    });
  });

  describe("#delete()", () => {
    it(`should behave as expected (node, authenticated)`, async () => {
      isomorphicUnfetch.mockResolvedValueOnce({ json: async () => Promise.resolve(), ok: true });
      isNode.mockReturnValueOnce(true);
      jsCookie.get.mockReturnValueOnce("aJwtToken");

      await api.delete("/a-path");

      expect(jsCookie.get).toHaveBeenNthCalledWith(1, "jwt");
      expect(isomorphicUnfetch).toHaveBeenNthCalledWith(1, "https://api.uri.docker/a-path", {
        headers: {
          Authorization: "Bearer aJwtToken",
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });
    });

    it(`should behave as expected (browser, authenticated)`, async () => {
      isomorphicUnfetch.mockResolvedValueOnce({ json: async () => Promise.resolve(), ok: true });
      isNode.mockReturnValueOnce(false);
      jsCookie.get.mockReturnValueOnce("aJwtToken");

      await api.delete("/a-path");

      expect(jsCookie.get).toHaveBeenNthCalledWith(1, "jwt");
      expect(isomorphicUnfetch).toHaveBeenNthCalledWith(1, "https://api.uri/a-path", {
        headers: {
          Authorization: "Bearer aJwtToken",
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });
    });
  });
});
