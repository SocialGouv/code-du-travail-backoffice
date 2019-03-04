import axios from "axios";
import Router from "next/router";

export default function() {
  const instance = axios.create({
    baseURL: "http://localhost:3200",
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
        Router.push("/login");

        throw undefined;
      }

      throw error;
    }
  );

  return instance;
}
