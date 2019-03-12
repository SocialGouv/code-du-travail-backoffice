import axios from "axios";
import getConfig from "next/config";
import Router from "next/router";

const API_URI = getConfig().publicRuntimeConfig.API_URI;

export default function() {
  const instance = axios.create({
    baseURL: API_URI,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
    }
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

  return instance;
}
