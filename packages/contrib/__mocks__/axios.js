import "axios";

jest.mock("axios", () => {
  const axios = {
    interceptors: {
      response: {
        use: () => void 0
      }
    },

    delete: async () => void 0,
    get: async () => void 0,
    patch: async () => void 0,
    post: async () => void 0,
    put: async () => void 0
  };

  jest.spyOn(axios, "delete");
  jest.spyOn(axios, "get");
  jest.spyOn(axios, "patch");
  jest.spyOn(axios, "post");
  jest.spyOn(axios, "put");

  return {
    ...axios,
    create: () => axios
  };
});
