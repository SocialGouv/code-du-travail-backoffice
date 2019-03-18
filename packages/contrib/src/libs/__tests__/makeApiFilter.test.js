import makeApiFilter from "../makeApiFilter";

describe("lib/makeApiFilter()", () => {
  it("should return the expected API filter URL", () => {
    const data = {
      aString: "string",
      anInteger: 1337
    };

    expect(makeApiFilter("/foo", data)).toBe(
      "/foo?aString=eq.string&anInteger=eq.1337"
    );
  });
});
