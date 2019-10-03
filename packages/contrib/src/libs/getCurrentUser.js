import jsCookie from "js-cookie";

import { USER_ROLE } from "../constants";

export default function getCurrentUser() {
  const me = jsCookie.get("me");

  if (me === undefined) return null;

  const mePayload = JSON.parse(me).payload;
  mePayload.isAdmin = [
    USER_ROLE.ADMINISTRATOR,
    USER_ROLE.REGIONAL_ADMINISTRATOR
  ].includes(mePayload.role);

  return mePayload;
}
