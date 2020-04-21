import _fetch from "isomorphic-unfetch";
import jsCookie from "js-cookie";

import isNode from "../helpers/isNode";

class ApiError extends Error {
  constructor({ message, ...props }) {
    super(message);

    Object.keys(props).forEach(prop => (this[prop] = props[prop]));
  }
}

class Api {
  async _fetch(method, path, body, { headers = {}, skipAuth }) {
    const apiUri =
      isNode() && process.env.NODE_ENV === "production"
        ? process.env.API_URI_DOCKER
        : process.env.API_URI;
    const jwt = jsCookie.get("jwt");
    const headersOptions = skipAuth
      ? { headers }
      : {
          headers: {
            ...headers,
            Authorization: jwt,
          },
        };

    const options = {
      ...headersOptions,
      method,
    };
    if (["PATCH", "POST"].includes(method)) {
      options.body = body;
    }

    const res = await _fetch(`${apiUri}${path}`, options);
    const data = await res.json();
    if (res.status < 200 || res.status >= 300) throw new ApiError(data);

    return data;
  }

  async get(path, skipAuth = false) {
    return await this._fetch("GET", path, undefined, { skipAuth });
  }

  async post(path, data, skipAuth = false) {
    return await this._fetch("POST", path, JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
      skipAuth,
    });
  }

  async patch(path, data, skipAuth = false) {
    return await this._fetch("PATCH", path, JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
      skipAuth,
    });
  }

  async delete(path, skipAuth = false) {
    return await this._fetch("DELETE", path, undefined, { skipAuth });
  }
}

export default new Api();
