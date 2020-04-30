const isJsonValid = require("../isJsonValid");

describe("helpers/isJsonValid()", () => {
  it(`should validate JSON strings`, () => {
    expect(isJsonValid(`{"key":"value"}`)).toStrictEqual(true);
    expect(isJsonValid(`["A string",123,null]`)).toStrictEqual(true);
  });

  it(`should invalidate non-JSON strings`, () => {
    expect(isJsonValid("")).toStrictEqual(false);
    expect(isJsonValid("A string")).toStrictEqual(false);
    expect(isJsonValid("{in braces}")).toStrictEqual(false);
    expect(isJsonValid("[in brackets]")).toStrictEqual(false);
  });
});
