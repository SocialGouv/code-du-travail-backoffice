const findAgreementArticles = require("../findAgreementArticles");

describe("libs/findAgreementArticles()", () => {
  it(`should find "Article 04.05.1" (0029)`, () => {
    const result = findAgreementArticles("0029", "Article 04.05.1");

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toStrictEqual("KALIARTI000029952604");
  });

  it(`should find "Avenant n° 1 Ouvriers et collaborateurs du 11 février 1971 Article 27" (0044)`, () => {
    const result = findAgreementArticles(
      "0044",
      "Avenant n° 1 Ouvriers et collaborateurs du 11 février 1971 Article 27",
    );

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toStrictEqual("KALIARTI000005846394");
  });
});
