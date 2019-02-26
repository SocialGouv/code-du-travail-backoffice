import customAxios from "./customAxios";

export default async function isAuthenticated() {
  const jwt = sessionStorage.getItem("jwt");

  if (typeof jwt !== "string" || jwt.length === 0) return false;

  // Let's try a quick API call to check is the JWT is valid
  const axios = customAxios(true);
  try {
    await axios.get("/answers");

    return true;
  } catch (error) {
    console.warn(error);

    return false;
  }
}
