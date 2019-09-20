import axios from "axios";

import isAuthenticated from "../isAuthenticated";

describe.skip("[Contrib] lib/isAuthenticated()", () => {
  const JWT = "aFakeToken";
  const ME = JSON.stringify({ payload: { agreements: [] } });

  axios.post.mockRejectedValueOnce();
  axios.post.mockResolvedValueOnce({
    data: [{ valid: false }]
  });
  axios.post.mockResolvedValueOnce({
    data: [{ valid: true }]
  });

  it("should return false with no `jwt` in session", async () => {
    expect(sessionStorage.getItem("jwt")).toBe(null);
    expect(await isAuthenticated()).toBe(false);
    expect(axios.post).toHaveBeenCalledTimes(0);
  });

  it("should return false with no `me` in session", async () => {
    sessionStorage.setItem("jwt", JWT);

    expect(sessionStorage.getItem("jwt")).toBe(JWT);
    expect(sessionStorage.getItem("me")).toBe(null);
    expect(await isAuthenticated()).toBe(false);
    expect(axios.post).toHaveBeenCalledTimes(0);
  });

  // eslint-disable-next-line max-len
  it("should return false when `me` doesn't have agreements in its payload", async () => {
    const oldMe = JSON.stringify({ payload: {} });
    sessionStorage.setItem("me", oldMe);

    expect(sessionStorage.getItem("me")).toBe(oldMe);
    expect(await isAuthenticated()).toBe(false);
    expect(axios.post).toHaveBeenCalledTimes(0);
  });

  it("should return false when /rpc/login_check rejects", async () => {
    sessionStorage.setItem("me", ME);

    expect(sessionStorage.getItem("me")).toBe(ME);
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
