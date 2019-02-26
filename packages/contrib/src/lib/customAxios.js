import axios from "axios";
import Router from "next/router";

export default function(skipAuthCheck) {
  const instance = axios.create({
    baseURL: "http://localhost:3200",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
    }
  });

  if (!Boolean(skipAuthCheck)) {
    instance.interceptors.response.use(
      response => response,
      error => {
        if (error.response !== undefined && error.response.data !== undefined) {
          if (error.response.data.message === "JWT expired") {
            Router.push("/login");
          }
        }

        return error;
      }
    );
  }

  return instance;
}
