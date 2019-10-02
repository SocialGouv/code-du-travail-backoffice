import customAxios from "./customAxios";
import postgrester from "postgrester";

export default function() {
  const postgrestClient = postgrester.create({
    axiosInstance: customAxios()
  });

  return postgrestClient;
}
