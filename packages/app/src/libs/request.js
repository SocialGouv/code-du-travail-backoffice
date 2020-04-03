// @ts-check

import fetch from "isomorphic-unfetch";

import catchError from "../helpers/catchError";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

/**
 * @param {"DELETE" | "GET" | "PATCH" | "POST" | "PUT"} method
 * @param {string} path
 * @param {object=} requestData
 * @param {object} requestHeaders
 */
export async function makeFetch(method, path, requestData, requestHeaders = {}) {
  try {
    const headers = {
      ...DEFAULT_HEADERS,
      requestHeaders,
    };

    const body = requestData !== undefined ? JSON.stringify(requestData) : "";

    const options = {
      body,
      headers,
      method,
    };

    const response = await fetch(path, options);
    const responseData = await response.json();

    if (response.status < 200 || response.status >= 300) {
      const error = new Error(`Request failed with status ${response.status}`);
      // @ts-ignore
      error.data = responseData;
    }

    return responseData;
  } catch (err) {
    catchError("libs/request/makeFetch()", err);
  }
}

/**
 * @param {string} path
 * @param {object=} headers
 *
 * @returns {Promise<object>}
 */
function _delete(path, headers = {}) {
  return makeFetch("DELETE", path, undefined, headers);
}

/**
 * @param {string} path
 * @param {object=} headers
 *
 * @returns {Promise<object>}
 */
function get(path, headers) {
  return makeFetch("GET", path, undefined, headers);
}

/**
 * @param {string} path
 * @param {object=} headers
 *
 * @returns {Promise<object>}
 */
function patch(path, data, headers) {
  return makeFetch("PATCH", path, data, headers);
}

/**
 * @param {string} path
 * @param {object=} data
 * @param {object=} headers
 *
 * @returns {Promise<object>}
 */
function post(path, data, headers) {
  return makeFetch("POST", path, data, headers);
}

/**
 * @param {string} path
 * @param {object=} data
 * @param {object=} headers
 *
 * @returns {Promise<object>}
 */
function put(path, data, headers) {
  return makeFetch("PUT", path, data, headers);
}

export default {
  delete: _delete,
  get,
  patch,
  post,
  put,
};
