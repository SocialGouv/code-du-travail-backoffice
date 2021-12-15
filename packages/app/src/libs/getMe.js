import jsCookie from "js-cookie";
import nextCookies from "next-cookies";

import { USER_ROLE } from "../constants";
import api from "./api";

const ANOMNYMOUS_RESPONSE = {
  data: null,
  isAuthenticated: false,
  token: null,
};

export default async function getMe(ctx) {
  const { jwt: token } = ctx === undefined ? jsCookie.get() : nextCookies(ctx);

  if (typeof token !== "string") return ANOMNYMOUS_RESPONSE;

  try {
    const data = await api.post("/rpc/login_check", { token }, { Authorization: "" });

    const isAuthenticated = data.valid;

    if (!isAuthenticated) return ANOMNYMOUS_RESPONSE;

    const isAdmin = [USER_ROLE.ADMINISTRATOR, USER_ROLE.REGIONAL_ADMINISTRATOR].includes(
      data.payload.role,
    );

    return {
      data: isAuthenticated ? data.payload : null,
      isAdmin,
      isAuthenticated,
      token,
    };
  } catch (err) {
    console.error(`[libs/getMe()] Error: ${err.message}`);

    return { ...ANOMNYMOUS_RESPONSE, err };
  }
}
