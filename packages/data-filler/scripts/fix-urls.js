const { updateRecord, getCollection } = require("./utils");
const pAll = require("p-all");
const { fixUrl } = require("./fixUrl");

const isValidUrl = url => {
  if (!url) {
    return false;
  }
  if (url.match(/^\/question\//)) {
    return false;
  }
  return true;
};

// set valid flag and fix url on a bunch of references [{url}, {url}]
const fixRefs = refs =>
  refs
    .filter(ref => isValidUrl(ref.url))
    .map(ref => {
      const fixedUrl = fixUrl(ref.url);
      if (!fixedUrl) {
        return {
          ...ref,
          valid: false
        };
      }
      return {
        ...ref,
        url: fixedUrl,
        valid: true
      };
    })
    .reduce((acc, cur) => {
      // prevent doublons
      if (!acc.find(r => r.url === cur.url)) {
        acc.push(cur);
      }
      return acc;
    }, []);

const getAllRefs = records =>
  records.reduce((acc, record) => [...acc, ...record.refs], []);

// mark and fix all record.refs in a collection
const fixCollection = async collection => {
  const records = await getCollection(collection);

  console.log("Status | url | correction");
  console.log("------ | --- | ----------");

  const validRecords = await pAll(
    records
      .filter(req => req.refs && req.refs.length)
      .map(record => () => {
        const newRefs = fixRefs(record.refs);
        newRefs
          .filter(ref => !ref.valid)
          .forEach(ref => {
            console.log(
              `Error in [${collection} ${record.id}](https://datafiller.num.social.gouv.fr/bucket/datasets/collection/${collection}/record/${record.id}) | ${ref.url} | `
            );
          });
        return updateRecord(collection, record.id, { refs: newRefs }).then(
          () => {
            return {
              ...record,
              refs: newRefs
            };
          }
        );
      }),
    { concurrency: 5 }
  );

  const allRefs = getAllRefs(validRecords);
  console.log(
    `\n## ${collection} : ${allRefs.filter(r => !r.valid).length}/${
      allRefs.length
    } wrong references\n`
  );
};

pAll([() => fixCollection("requetes"), () => fixCollection("themes")], {
  concurrency: 1
});
