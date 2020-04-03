// @ts-check

import * as Sentry from "@sentry/browser";

import toast from "../libs/toast";

/**
 * Create and handle errors.
 *
 * @param {string} path
 * @param {Error | string} errorOrMessage
 * @param {object=} data
 *
 * @returns {void}
 */
export default function catchError(path, errorOrMessage, data) {
  try {
    const error = new Error();
    /** @type {string} */
    let newMessage =
      typeof errorOrMessage === "string"
        ? `${path}: ${errorOrMessage}`
        : `${path}: ${errorOrMessage.message}`;

    if (data !== undefined) {
      const { errors, message } = data;

      if (typeof message === "string") {
        newMessage += `with ${message}`;
      } else if (Array.isArray(errors) && errors.length > 0 && typeof errors[0] === "string") {
        newMessage += `with ${errors.join(", ")}`;
      }
    }

    error.message = newMessage;

    if (errorOrMessage instanceof Error) {
      error.name = errorOrMessage.name;
      error.stack = errorOrMessage.stack;
    }

    Sentry.captureException(error);
    toast.error(newMessage);
  } catch (err) {
    err.message = `helpers/catchError(): ${err.message}`;

    Sentry.captureException(err);
  }
}
