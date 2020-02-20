import capitalize from "../capitalize";

describe("helpers/capitalize()", () => {
  it("should return the expected capitalized text", () => {
    expect(capitalize("a string")).toStrictEqual("A string");
  });
});
