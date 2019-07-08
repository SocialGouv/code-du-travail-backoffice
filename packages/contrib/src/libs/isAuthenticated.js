import axios from "axios";
import getConfig from "next/config";

const API_URI = getConfig().publicRuntimeConfig.API_URI;

export default async function isAuthenticated() {
  const token = sessionStorage.getItem("jwt");
  const me = JSON.parse(sessionStorage.getItem("me"));

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    me.payload.agreements === undefined
  ) {
    return false;
  }

  try {
    const { data } = await axios.post(`${API_URI}/rpc/login_check`, { token });

    return data[0].valid;
  } catch (error) {
    return false;
  }
}
