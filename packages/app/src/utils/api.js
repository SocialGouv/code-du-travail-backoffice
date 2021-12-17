import axios from "axios";
import jsCookie from "js-cookie";

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
      data,
      headers: {
        Authorization: `Bearer ${jsCookie.get("jwt")}`,
      },
      method,
      url: process.env.API_URI + path,
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
