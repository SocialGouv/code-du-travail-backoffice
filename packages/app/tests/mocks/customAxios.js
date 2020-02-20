import "../../src/libs/customAxios";

global.axios = {
  delete: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
};

jest.mock("../../src/libs/customAxios", () => () => {
  return global.axios;
});
