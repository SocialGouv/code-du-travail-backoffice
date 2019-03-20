import axios from "axios";

import isAuthenticated from "../isAuthenticated";

describe("[Contrib] lib/isAuthenticated()", () => {
  axios.post.mockRejectedValueOnce();
  axios.post.mockResolvedValueOnce({
    data: [{ valid: false }]
  });
  axios.post.mockResolvedValueOnce({
    data: [{ valid: true }]
  });

  it("should return false with no JWT in session", async () => {
    expect(sessionStorage.getItem("jwt")).toBe(null);
    expect(await isAuthenticated()).toBe(false);
    expect(axios.post).toHaveBeenCalledTimes(0);
  });

  it("should return false when /rpc/login_check rejects", async () => {
    const token = "aFakeToken";
    sessionStorage.setItem("jwt", token);

    expect(sessionStorage.getItem("jwt")).toBe(token);
    expect(await isAuthenticated()).toBe(false);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  // eslint-disable-next-line max-len
  it("should return false when /rpc/login_check invalidates the JWT", async () => {
    expect(await isAuthenticated()).toBe(false);
    expect(axios.post).toHaveBeenCalledTimes(2);
  });

  it("should return true when /rpc/login_check validates the JWT", async () => {
    expect(await isAuthenticated()).toBe(true);
    expect(axios.post).toHaveBeenCalledTimes(3);
  });
});
