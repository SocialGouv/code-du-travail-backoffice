import axios from "axios";
import Router from "next/router";

const { API_URI } = process.env;

const instance = axios.create({
  baseURL: API_URI
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
      Router.push(`/login?redirectTo=${window.location.pathname}`);

      throw undefined;
    }

    throw error;
  }
);

export default function() {
  const jwt = sessionStorage.getItem("jwt");
  if (jwt !== null) {
    const authorization = `Bearer ${sessionStorage.getItem("jwt")}`;
    instance.defaults.headers["Authorization"] = authorization;
  } else if (!window.location.pathname.startsWith("/login")) {
    Router.push(`/login?redirectTo=${window.location.pathname}`);

    throw undefined;
  }

  return instance;
}
