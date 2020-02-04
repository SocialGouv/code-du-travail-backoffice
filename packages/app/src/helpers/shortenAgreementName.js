export default function shortenAgreementName(name) {
  return name
    .replace(/^Conventions? collectives? nationales?/i, "CCN")
    .replace(/^Conventions? collectives? régionales?/i, "CCR")
    .replace(/^Conventions? collectives? interrégionales?/i, "CCIR")
    .replace(/^Conventions? collectives? départementales?/i, "CCD")
    .replace(/^Conventions? collectives? locales?/i, "CCL");
}
