import isNode from "../isNode";

describe("helpers/isNode()", () => {
  it("should return FALSE when running on client side", () => {
    expect(isNode()).toStrictEqual(false);
  });

  it("should return TRUE when running on server side", () => {
    delete global.window;

    expect(isNode()).toStrictEqual(true);
  });
});
