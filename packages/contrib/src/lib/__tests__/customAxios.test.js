import "../../../__mocks__/sessionStorage";

import customAxios from "../customAxios";

// TODO Find a way to test the interceptor?
describe("[Contrib] lib/customAxios()", () => {
  let _axios;
  const token = "aFakeToken";

  // eslint-disable-next-line max-len
  it("should set the axios instance as expected with no JWT in session", async () => {
    _axios = customAxios();

    expect(_axios.defaults.headers["Authorization"]).toBe("Bearer null");
    expect(_axios.defaults.baseURL).toBe("http://localhost:3200");
    expect(sessionStorage.getItem("jwt")).toBe(null);
  });

  // eslint-disable-next-line max-len
  it("should set the axios instance as expected with a JWT in session", async () => {
    sessionStorage.setItem("jwt", token);
    _axios = customAxios();

    expect(_axios.defaults.headers["Authorization"]).toBe(`Bearer ${token}`);
    expect(_axios.defaults.baseURL).toBe("http://localhost:3200");
    expect(sessionStorage.getItem("jwt")).toBe(token);
  });
});
