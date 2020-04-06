const isUuidValid = require("../isUuidValid");

describe("helpers/isUuidValid()", () => {
  it(`should validate v4 UUIDs`, () => {
    expect(isUuidValid("6c9a6647-95bc-4dc7-93a4-691d8ba84b9a")).toStrictEqual(true);
    expect(isUuidValid("6C9A6647-95BC-4DC7-93A4-691D8BA84B9A")).toStrictEqual(true);
  });

  it(`should invalidate v1 UUID`, () => {
    expect(isUuidValid("695d5a00-75dc-11ea-bc55-0242ac130003")).toStrictEqual(false);
  });
});
