import jsCookie from "js-cookie";
import axios from "axios";

export type ApiFetchType = "GET" | "POST" | "PUT" | "DELETE";

export function apiFetch(
  method: ApiFetchType,
  path: string,
  data?: Record<string, any>,
): Promise<any> {
  return new Promise((resolve, reject) => {
    axios({
      method,
      url: process.env.API_URI + path,
      data,
      headers: {
        Authorization: `Bearer ${jsCookie.get("jwt")}`,
      },
    }).then(
      result => {
        resolve(result);
      },
      error => {
        reject(error);
      },
    );
  });
}
