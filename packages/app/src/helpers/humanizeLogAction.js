// @ts-check

import * as C from "../constants";

/**
 * @param {Log.Method} method
 * @param {string} path
 *
 * @returns {string | null}
 */
export default function humanizeLogAction(method, path) {
  switch (true) {
    case method === C.LOG_METHOD.POST && path === "/rpc/login":
      return "Connexion";

    case method === C.LOG_METHOD.POST && path === "/rpc/login_check":
      return "Authentification";

    case method === C.LOG_METHOD.DELETE:
      return "Suppression";

    case method === C.LOG_METHOD.PATCH:
      return "Modification";

    case method === C.LOG_METHOD.POST:
      return "Insertion";

    default:
      return "N/A";
  }
}
