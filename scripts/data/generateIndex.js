const fs = require("fs");
const path = require("path");
const unistUtilFlatFilter = require("unist-util-flat-filter");

const DEST_PATH = path.join(__dirname, `../../packages/api/data/index.json`);

const AGREEMENTS_INDEX = require("@socialgouv/kali-data/data/index.json");

const articlesIndex = AGREEMENTS_INDEX.reduce((prev, { id: agreementId }) => {
  const agreement = require(`@socialgouv/kali-data/data/${agreementId}.json`);
  const flatArticles = unistUtilFlatFilter(agreement, "article");

  if (flatArticles === null) return prev;

  const articles = flatArticles.children.map(article => article.data);
  const index = articles.map(({ id }) => ({
    agreementId,
    id,
  }));

  return [...prev, ...index];
}, []);

fs.writeFileSync(DEST_PATH, JSON.stringify(articlesIndex, null, 2));
