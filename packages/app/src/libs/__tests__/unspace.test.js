import unspace from "../unspace";

describe("lib/unspace()", () => {
  it("should trim spaces", () => {
    expect(unspace(" A")).toBe("A");
    expect(unspace("A ")).toBe("A");
    expect(unspace(" A ")).toBe("A");
    expect(unspace("  A")).toBe("A");
    expect(unspace("A  ")).toBe("A");
    expect(unspace("  A  ")).toBe("A");
    expect(unspace("   A")).toBe("A");
    expect(unspace("A   ")).toBe("A");
    expect(unspace("   A   ")).toBe("A");
  });

  it("should merge spaces", () => {
    expect(unspace("A  B")).toBe("A B");
    expect(unspace("A   B")).toBe("A B");
    expect(unspace(" A   B ")).toBe("A B");
    expect(unspace("  A   B  ")).toBe("A B");
  });
});
