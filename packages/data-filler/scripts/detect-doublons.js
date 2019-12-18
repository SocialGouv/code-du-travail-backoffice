const { getCollection } = require("./utils");

const getVariants = record =>
  [record.title].concat(
    (record.variants &&
      record.variants
        .trim()
        .split("\n")
        .map(q => q.trim())
        .filter(Boolean)) ||
      []
  );

const delimiter = " | ";

// mark and fix all record.refs in a collection
const detectDoublonsThemes = async () => {
  const records = await getCollection("themes");

  const urls = {};

  const getThemeTitle = id => records.find(record => record.id === id).title;

  records.forEach(record => {
    record.refs &&
      record.refs
        .filter(ref => !!ref.url)
        .forEach(ref => {
          const baseUrl = ref.url.split("#")[0];
          if (!urls[baseUrl]) {
            urls[baseUrl] = [];
          }
          if (!urls[baseUrl].includes(record.id)) {
            urls[baseUrl].push(record.id);
          }
        });
  });

  console.log("\n## Liens en doubles dans les themes\n");
  console.log("url      | theme");
  console.log("-------- | ---------");

  Object.keys(urls)
    .filter(url => urls[url].length > 1)
    .forEach(url => {
      urls[url].forEach(theme => {
        console.log(
          `${url} | [${getThemeTitle(
            theme
          )}](https://datafiller.num.social.gouv.fr/bucket/datasets/collection/themes/record/${theme})`
        );
      });
    });

  // console.log("\n## Fiches par thème\n");
  // console.log("\n");
  // console.log("\n");
  // console.log(`Url${delimiter}Theme`);
  // console.log(`----${delimiter}----`);
  // Object.keys(urls)
  //   .filter(url => urls[url].length > 1)
  //   .forEach(url => {
  //     urls[url].forEach(theme => {
  //       console.log(`"${url}"${delimiter}"${getThemeTitle(theme)}"`);
  //     });
  //   });
  // console.log("\n");
  // console.log("\n");
};

const detectDoublonsRequetes = async () => {
  const records = await getCollection("requetes");
  const getRequeteTitle = id => records.find(record => record.id === id).title;
  const queries = {};
  records.forEach(record => {
    const variants = [
      record.title,
      ...((record.variants && getVariants(record)) || [])
    ];
    variants.forEach(variant => {
      if (!queries[variant]) {
        queries[variant] = [];
      }
      if (!queries[variant].includes(record.id)) {
        queries[variant].push(record.id);
      }
    });
  });

  console.log("\n## Expressions en double dans les requêtes\n");
  console.log(`variante${delimiter}recherche`);
  console.log(`----${delimiter}----`);
  Object.keys(queries)
    .filter(variant => queries[variant].length > 1)
    .forEach(variant => {
      queries[variant].forEach(query => {
        console.log(
          `${variant}${delimiter}[${getRequeteTitle(
            query
          )}](https://datafiller.num.social.gouv.fr/bucket/datasets/collection/requetes/record/${query})`
        );
      });
    });

  // console.log("\n");
  // console.log("\n");
  // console.log("Variante;Requete");
  // Object.keys(queries)
  //   .filter(variant => queries[variant].length > 1)
  //   .forEach(variant => {
  //     queries[variant].forEach(query => {
  //       console.log(`"${variant}";"${getRequeteTitle(query)}"`);
  //     });
  //   });
  // console.log("\n");
  // console.log("\n");

  console.log("\n");
  console.log("\n");
  console.log("\n## Stats sur les requêtes\n");
  console.log("\n");
  console.log(
    `Requete${delimiter}Nb variantes${delimiter}Nb urls${delimiter}Nb scores${delimiter}theme`
  );
  console.log(
    `---${delimiter}---${delimiter}---${delimiter}---${delimiter}---`
  );
  Object.keys(records).forEach(record => {
    //console.log("query", query);
    //queries[variant].forEach(query => {
    console.log(
      `[${
        records[record].title
      }](https://datafiller.num.social.gouv.fr/bucket/datasets/collection/requetes/record/${
        records[record].id
      })${delimiter}${
        getVariants(records[record]).length
      }${delimiter}${(records[record].refs && records[record].refs.length) ||
        0}${delimiter}${(records[record].refs &&
        records[record].refs.length &&
        records[record].refs.filter(ref => ref.relevance !== undefined)
          .length) ||
        0}${delimiter}${records[record].theme ? 1 : 0}`
    );
    //});
  });
  console.log("\n");
  console.log("\n");
};

detectDoublonsThemes();
detectDoublonsRequetes();
