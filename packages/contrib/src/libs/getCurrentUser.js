import jsCookie from "js-cookie";

export default function getCurrentUser() {
  const me = jsCookie.get("me");

  return me !== undefined ? JSON.parse(me).payload : null;
}
