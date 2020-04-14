import getLabelAndContent from "../getLabelAndContent";

describe("components/LegalReferences/getLabelAndContent()", () => {
  it(`should return the expected value for a non-linked legal reference`, async () => {
    const result = await getLabelAndContent("A value", null);

    expect(result[0]).toStrictEqual("A value");
    expect(result[1]).toBeNull();
  });
});
