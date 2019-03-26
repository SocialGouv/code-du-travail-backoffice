import "../src/libs/customAxios";

jest.mock("../src/libs/customAxios", () => () => {
  const customAxios = {
    delete: async () => void 0,
    get: async () => void 0,
    patch: async () => void 0,
    post: async () => void 0,
    put: async () => void 0
  };

  jest.spyOn(customAxios, "delete");
  jest.spyOn(customAxios, "get");
  jest.spyOn(customAxios, "patch");
  jest.spyOn(customAxios, "post");
  jest.spyOn(customAxios, "put");

  return customAxios;
});
