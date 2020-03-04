const fs = require("fs");
const path = require("path");

const DEST_PATH = path.join(__dirname, `../../packages/api/data/index.json`);

const AGREEMENTS_INDEX = require("@socialgouv/kali-data/data/index.json");

function flattenChildren(tree, articleOrSection) {
  const { id } = articleOrSection.data;

  // Skip duplicates:
  if (tree.length !== 0 && id === tree[tree.length - 1].data.id) {
    return tree;
  }

  if (articleOrSection.children === undefined) {
    return [...tree, articleOrSection];
  }

  return [...tree, articleOrSection, ...articleOrSection.children.reduce(flattenChildren, [])];
}

const articlesIndex = AGREEMENTS_INDEX.reduce((prev, { id: agreementId }) => {
  const agreement = require(`@socialgouv/kali-data/data/${agreementId}.json`);
  const flatArticles = agreement.children.reduce(flattenChildren, []);
  // console.log(flatArticles[0]);

  const index = flatArticles.map(({ data: { id } }) => ({
    agreementId,
    id,
  }));

  return [...prev, ...index];
}, []);

fs.writeFileSync(DEST_PATH, JSON.stringify(articlesIndex, null, 2));
