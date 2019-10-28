jest.unmock("../customAxios");

describe.skip("[Contrib] libs/customAxios()", () => {
  // eslint-disable-next-line max-len
  it("should redirect to /login with no JWT in session", () => {
    jest.unmock("axios");
    const customAxios = require("../customAxios").default;

    // https://www.ryandoll.com/post/2018/3/29/jest-and-url-mocking
    window.history.pushState({}, "A Page", "/a-path");

    expect(() => customAxios()).toThrow(undefined);
    expect(global.nextRouter.push).toHaveBeenCalledWith("/login?redirectTo=/a-path");
  });

  // eslint-disable-next-line max-len
  it(`should return an non-authenticated "axios" instance with no JWT in session`, () => {
    jest.unmock("axios");
    const customAxios = require("../customAxios").default;

    // https://www.ryandoll.com/post/2018/3/29/jest-and-url-mocking
    window.history.pushState({}, "Login Page", "/login");
    const _axios = customAxios();

    expect(_axios.defaults.headers["Authorization"]).toBe(undefined);
    expect(_axios.defaults.baseURL).toBe("http://localhost:3200");
    expect(sessionStorage.getItem("jwt")).toBe(null);
  });

  // eslint-disable-next-line max-len
  it(`should return an authenticated "axios" instance with a JWT in session`, async () => {
    jest.unmock("axios");
    const customAxios = require("../customAxios").default;

    const token = "aFakeToken";
    sessionStorage.setItem("jwt", token);
    const _axios = customAxios();

    expect(_axios.defaults.headers["Authorization"]).toBe(`Bearer ${token}`);
    expect(_axios.defaults.baseURL).toBe("http://localhost:3200");
    expect(sessionStorage.getItem("jwt")).toBe(token);
    expect(_axios.interceptors.request.handlers.length).toBe(0);
    expect(_axios.interceptors.response.handlers.length).toBe(1);
    expect(typeof _axios.interceptors.response.handlers[0].fulfilled).toBe("function");
    expect(typeof _axios.interceptors.response.handlers[0].rejected).toBe("function");
  });
});
