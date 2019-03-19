import axios from "axios";
import getConfig from "next/config";
import Router from "next/router";

const instance = axios.create({
  baseURL: getConfig().publicRuntimeConfig.API_URI
});

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

    if (instance.defaults.headers["Authorization"] !== authorization) {
      instance.defaults.headers["Authorization"] = authorization;
    }
  } else if (!window.location.pathname.startsWith("/login")) {
    Router.push(`/login?redirectTo=${window.location.pathname}`);

    throw undefined;
  }

  return instance;
}
