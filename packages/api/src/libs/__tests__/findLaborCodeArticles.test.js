const findLaborCodeArticles = require("../findLaborCodeArticles");

describe("libs/findLaborCodeArticles()", () => {
  // TODO Find what's wrong here.
  it(`should find "L1223-5`, () => {
    const result = findLaborCodeArticles("L1223-5");

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toStrictEqual("LEGIARTI000006900872");
  });

  it(`should find "R1111.1`, () => {
    const result = findLaborCodeArticles("R1111.1");

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toStrictEqual("LEGIARTI000018538086");
  });
});
