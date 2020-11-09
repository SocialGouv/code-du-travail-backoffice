import jsCookie from "js-cookie";
import postgrester from "postgrester";

let postgrestClient;

export default function customPostgrester() {
  if (postgrestClient === undefined) {
    postgrestClient = postgrester.create({
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
