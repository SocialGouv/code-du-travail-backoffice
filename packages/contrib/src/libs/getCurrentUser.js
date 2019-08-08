export default function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("me")).payload;
}
