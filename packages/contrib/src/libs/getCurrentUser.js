import cache from "../cache";

import { USER_ROLE } from "../constants";

export default function getCurrentUser() {
  const { data } = cache.get("me");

  data.isAdmin = [USER_ROLE.ADMINISTRATOR, USER_ROLE.REGIONAL_ADMINISTRATOR].includes(data.role);

  return data;
}
