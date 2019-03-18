import "../../../__mocks__/console";
import "../../../__mocks__/sessionStorage";

import axios from "axios";
jest.mock("axios");

import isAuthenticated from "../isAuthenticated";

describe("[Contrib] lib/isAuthenticated()", () => {
  axios.get.mockRejectedValueOnce();
  axios.get.mockResolvedValueOnce();

  it("should return false with no JWT in session", async () => {
    expect(sessionStorage.getItem("jwt")).toBe(null);
    expect(await isAuthenticated()).toBe(false);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });

  it("should return false when /api/answers rejects", async () => {
    const token = "aFakeToken";
    sessionStorage.setItem("jwt", token);

    expect(sessionStorage.getItem("jwt")).toBe(token);
    expect(await isAuthenticated()).toBe(false);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it("should return true when /api/answers resolves", async () => {
    expect(await isAuthenticated()).toBe(true);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
