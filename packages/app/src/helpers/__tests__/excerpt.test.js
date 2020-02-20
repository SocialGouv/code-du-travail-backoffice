import React from "react";

import excerpt from "../excerpt";

describe("helpers/excerpt()", () => {
  it("should return the expected message when the text is empty", () => {
    expect(excerpt("")).toStrictEqual(<em>Aucun contenu.</em>);
    expect(excerpt(" ")).toStrictEqual(<em>Aucun contenu.</em>);
  });

  it("should return the text as-is when it's less than 100 chars long", () => {
    const lessThanOneHundredCharsText =
      `I have to write a less than 100 characters long text, but I don't get ` +
      `so much inspiration.`;

    expect(lessThanOneHundredCharsText.length).toBeLessThan(100);
    expect(excerpt(lessThanOneHundredCharsText)).toStrictEqual(lessThanOneHundredCharsText);
  });

  it("should return the text as-is when it's 100 chars long", () => {
    const oneHundredCharsText =
      `I have to write a 100 characters long text, but I don't get so much ` +
      `inspiration about its substance.`;

    expect(oneHundredCharsText.length).toStrictEqual(100);
    expect(excerpt(oneHundredCharsText)).toStrictEqual(oneHundredCharsText);
  });

  it("should return the expected excerpts for these texts", () => {
    const firstText =
      `Il ne faut écrire qu'au moment où à chaque fois que tu trempes ta ` +
      `plume dans l'encre, un morceau de ta chair reste dans  l'encrier.`;
    const firstExcerpt =
      `Il ne faut écrire qu'au moment où à chaque fois que tu trempes ta ` +
      `plume dans l'encre, un morceau de…`;

    expect(excerpt(firstText)).toStrictEqual(firstExcerpt);

    const secondText =
      `Les plus fous sont indubitablement ceux qui décèlent chez les autres ` +
      `les signes de la folie qu'ils ne voient pas en eux.`;
    const secondExcerpt =
      `Les plus fous sont indubitablement ceux qui décèlent chez les autres ` +
      `les signes de la folie qu'ils…`;

    expect(excerpt(secondText)).toStrictEqual(secondExcerpt);
  });
});
