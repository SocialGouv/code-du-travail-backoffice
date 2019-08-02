import capitalize from "../capitalize";

describe("[Contrib] helpers/capitalize()", () => {
  it("should return the expected capitalized text", () => {
    expect(capitalize("a string")).toStrictEqual("A string");
  });
});
