import { validateMandatoryNullableOneOf, validateMandatoryNullableString } from "../validators";

describe("props/validators.validateMandatoryNullableOneOf()", () => {
  const validate = validateMandatoryNullableOneOf(["a string", 123]);

  it("should validate an included prop value", () => {
    expect(validate({ aProp: "a string" }, "aProp", "TheComponent")).toBeUndefined();
    expect(validate({ aProp: 123 }, "aProp", "TheComponent")).toBeUndefined();
  });

  it("should validate a {null} prop", () => {
    expect(validate({ aProp: null }, "aProp", "TheComponent")).toBeUndefined();
  });

  it("should invalidate a non-included prop value", () => {
    expect(validate({ aProp: "an other string" }, "aProp", "TheComponent")).toBeInstanceOf(Error);
  });

  it("should invalidate an {undefined} prop", () => {
    expect(validate({}, "aProp", "TheComponent")).toBeInstanceOf(Error);
    expect(validate({ aProp: undefined }, "aProp", "TheComponent")).toBeInstanceOf(Error);
  });
});

describe("props/validators.validateMandatoryNullableString()", () => {
  const validate = validateMandatoryNullableString;

  it("should validate a {string} prop", () => {
    expect(validate({ aProp: "a string" }, "aProp", "TheComponent")).toBeUndefined();
  });

  it("should validate a {null} prop", () => {
    expect(validate({ aProp: null }, "aProp", "TheComponent")).toBeUndefined();
  });

  it("should invalidate a {number} prop", () => {
    expect(validate({ aProp: 123 }, "aProp", "TheComponent")).toBeInstanceOf(Error);
  });

  it("should invalidate an {undefined} prop", () => {
    expect(validate({}, "aProp", "TheComponent")).toBeInstanceOf(Error);
    expect(validate({ aProp: undefined }, "aProp", "TheComponent")).toBeInstanceOf(Error);
  });
});
