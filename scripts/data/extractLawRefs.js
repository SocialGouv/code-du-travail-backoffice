const fs = require("fs");

const data = require("./code-du-travail-20190701.json");

const lawRefs = data
  .map(({ num }) => num)
  // Remove strange L1, L2, L3 & Annexes... results.
  .filter(ref => ref.length > 2 && /^[DRL]/.test(ref))
  // Remove duplicates:
  // https://stackoverflow.com/a/9229821/2736233
  .sort()
  .filter((item, pos, ary) => !pos || item != ary[pos - 1]);

fs.writeFileSync(
  `${__dirname}/../../packages/app/src/data/labor-law-references.json`,
  JSON.stringify(lawRefs, null, 2)
);
