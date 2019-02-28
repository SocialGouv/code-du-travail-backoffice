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
      if (error.response !== undefined && error.response.data !== undefined) {
        const jwt = sessionStorage.getItem("jwt");

        if (
          typeof jwt !== "string" ||
          jwt.length === 0 ||
          error.response.data.message === "JWT expired" ||
          // Malformed JWT case:
          error.response.data.message.startsWith("JWSError")
        ) {
          Router.push("/login");
        }
      }

      return error;
    }
  );

  return instance;
}
