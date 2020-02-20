import postgrester from "postgrester";

import customAxios from "./customAxios";

export default function() {
  const postgrestClient = postgrester.create({
    axiosInstance: customAxios(),
  });

  return postgrestClient;
}
