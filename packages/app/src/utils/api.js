import jsCookie from "js-cookie";
import axios from "axios";

/**
 *
 * @param {string} "GET" | "POST" | "PUT" | "DELETE"
 * @param {string} path
 * @param {Record<string, any>} data
 * @returns
 */
export function apiFetch(method, path, data) {
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
