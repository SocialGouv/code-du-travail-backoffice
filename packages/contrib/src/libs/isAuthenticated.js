import axios from "axios";
import jsCookie from "js-cookie";

import getCurrentUser from "./getCurrentUser";

const { API_URI } = process.env;

export default async function isAuthenticated() {
  const jwt = jsCookie.get("jwt");
  const me = getCurrentUser();

  if (
    typeof jwt !== "string" ||
    jwt.length === 0 ||
    me === null ||
    me.agreements === undefined
  ) {
    return false;
  }

  try {
    const { data } = await axios.post(`${API_URI}/rpc/login_check`, {
      token: jwt
    });

    return data[0].valid;
  } catch (error) {
    return false;
  }
}
