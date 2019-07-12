import axios from "axios";

const { API_URI } = process.env;

export default async function isAuthenticated() {
  const token = sessionStorage.getItem("jwt");
  const me = JSON.parse(sessionStorage.getItem("me"));

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    me === null ||
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
