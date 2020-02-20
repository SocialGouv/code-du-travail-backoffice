import axios from "axios";
import Router from "next/router";

import cache from "../cache";

const instance = axios.create({
  baseURL: process.env.API_URI,
});

// We can't possibly test this interceptor since we would need to partially
// mock at least one axios instance (i.e. `axios.post()`) method that needs to
// be generated via the unmocked `axios.create()` in order to properly work.
/* istanbul ignore next */
instance.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response !== undefined &&
      error.response.status !== undefined &&
      error.response.status === 401
    ) {
      Router.reload();

      return;
    }

    throw error;
  },
);

export default function() {
  const { token } = cache.get("me");

  const authorization = `Bearer ${token}`;
  instance.defaults.headers["Authorization"] = authorization;

  return instance;
}
