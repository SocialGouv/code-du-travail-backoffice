import jsCookie from "js-cookie";
import { create } from "postgrester";

let postgrestClient;

export default function customPostgrester() {
  if (postgrestClient === undefined) {
    postgrestClient = create({
      axiosConfig: {
        baseURL: process.env.API_URI,
        headers: {
          authorization: `Bearer ${jsCookie.get("jwt")}`,
        },
      },
    });
  }

  return postgrestClient;
}
