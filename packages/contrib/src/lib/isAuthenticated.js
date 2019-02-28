import axios from "axios";

export default async function isAuthenticated() {
  const jwt = sessionStorage.getItem("jwt");

  if (typeof jwt !== "string" || jwt.length === 0) return false;

  // Let's try a quick API call to check is the JWT is valid
  try {
    await axios.get("/answers", {
      baseURL: "http://localhost:3200",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
      }
    });

    return true;
  } catch (error) {
    console.warn(error);

    return false;
  }
}
