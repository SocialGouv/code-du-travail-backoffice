// @ts-check

import isomorphicUnfetch from "isomorphic-unfetch";
import jsCookie from "js-cookie";

import isNode from "../helpers/isNode";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

class ApiError extends Error {
  constructor({ message, ...props }) {
    super(message);

    Object.keys(props).forEach(prop => (this[prop] = props[prop]));
  }
}

class Api {
  /**
   * @private
   *
   * @param {"DELETE" | "GET" | "PATCH" | "POST"} method
   * @param {string} path
   * @param {RequestInit["body"]} body
   * @param {HeadersInit} headers
   *
   * @returns {Promise<*>}
   */
  async fetch(method, path, body, headers) {
    const apiUri =
      isNode() && process.env.NODE_ENV === "production"
        ? process.env.API_URI_DOCKER
        : process.env.API_URI;
    const maybeJwt = jsCookie.get("jwt");

    /** @type {RequestInit} */
    const options = {
      headers: {},
      method,
    };

    // Body:
    if (["PATCH", "POST"].includes(method)) {
      options.body = body;
    }

    // Headers:
    if (options.headers !== undefined && maybeJwt !== undefined) {
      options.headers["Authorization"] = `Bearer ${maybeJwt}`;
    }
    options.headers = { ...options.headers, ...headers };

    const response = await isomorphicUnfetch(`${apiUri}${path}`, options);

    const data = await this.parseResponseData(response);

    if (!response.ok) {
      if (data.message === undefined) {
        data.message = "The server answered with an unknown error (no message).";
      }

      throw new ApiError(data);
    }

    return data;
  }

  /**
   * @private
   *
   * @param {Response} response
   *
   * @returns {Promise<*>}
   */
  async parseResponseData(response) {
    try {
      // No Content:
      if (response.status === 204) {
        return {};
      }

      // `response.json()` may trigger an error if the response is empty or a non-JSON value:
      return await response.json();
    } catch (err) {
      return {};
    }
  }

  /**
   * @param {string} path
   * @param {HeadersInit=} headers
   *
   * @returns {Promise<*>}
   */
  async get(path, headers = {}) {
    return await this.fetch("GET", path, undefined, { ...DEFAULT_HEADERS, ...headers });
  }

  /**
   * @param {string} path
   * @param {{ [key: string]: * }} data
   * @param {HeadersInit=} headers
   *
   * @returns {Promise<*>}
   */
  async post(path, data, headers = {}) {
    return await this.fetch("POST", path, JSON.stringify(data), { ...DEFAULT_HEADERS, ...headers });
  }

  /**
   * @param {string} path
   * @param {{ [key: string]: * }} data
   * @param {HeadersInit=} headers
   *
   * @returns {Promise<*>}
   */
  async patch(path, data, headers = {}) {
    return await this.fetch("PATCH", path, JSON.stringify(data), {
      ...DEFAULT_HEADERS,
      ...headers,
    });
  }

  /**
   * @param {string} path
   * @param {HeadersInit=} headers
   *
   * @returns {Promise<*>}
   */
  async delete(path, headers = {}) {
    return await this.fetch("DELETE", path, undefined, { ...DEFAULT_HEADERS, ...headers });
  }
}

export default new Api();
