import shortenAgreementName from "../shortenAgreementName";

describe("helpers/shortenAgreementName()", () => {
  it("should return the expected name for a national agreement", () => {
    expect(shortenAgreementName("convention collective nationale de la métallurgie")).toStrictEqual(
      "CCN de la métallurgie"
    );
    expect(
      shortenAgreementName("conventions collectives nationales de la métallurgie")
    ).toStrictEqual("CCN de la métallurgie");
  });

  it("should return the expected name for a regional agreement", () => {
    expect(shortenAgreementName("convention collective régionale de la métallurgie")).toStrictEqual(
      "CCR de la métallurgie"
    );
    expect(
      shortenAgreementName("conventions collectives régionales de la métallurgie")
    ).toStrictEqual("CCR de la métallurgie");
  });

  it("should return the expected name for an interregional agreement", () => {
    expect(
      shortenAgreementName("convention collective interrégionale de la métallurgie")
    ).toStrictEqual("CCIR de la métallurgie");
    expect(
      shortenAgreementName("conventions collectives interrégionales de la métallurgie")
    ).toStrictEqual("CCIR de la métallurgie");
  });

  it("should return the expected name for a departemental agreement", () => {
    expect(
      shortenAgreementName("convention collective départementale de la métallurgie")
    ).toStrictEqual("CCD de la métallurgie");
    expect(
      shortenAgreementName("conventions collectives départementales de la métallurgie")
    ).toStrictEqual("CCD de la métallurgie");
  });

  it("should return the expected name for a local agreement", () => {
    expect(shortenAgreementName("convention collective locale de la métallurgie")).toStrictEqual(
      "CCL de la métallurgie"
    );
    expect(shortenAgreementName("conventions collectives locales de la métallurgie")).toStrictEqual(
      "CCL de la métallurgie"
    );
  });
});
