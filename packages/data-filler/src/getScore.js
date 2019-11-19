

const getRefsCount = item => item.refs && item.refs.filter(r => r.url).length || 0
const getVariantsCount = item => item.variants && item.variants.split("\n").filter(r => !!r.trim()).length || 0

const getScore = (collection, item) => {
  let score = 0;
  const refs = getRefsCount(item)
  const variants = getVariantsCount(item)

  if (collection === "requetes") {
    score += Math.min(50, refs * 10);
    score +=  Math.min(50, variants * 10);
    if (item.theme) {
      score += 50;
    } else {
      score -= 80;
    }
  }
  if (collection === "glossaire") {
    score += item.definition ? Math.min(40, item.definition.length * 5) : 0;
    score += Math.min(50, refs * 10);
    score +=  Math.min(30, variants * 10);
    score +=  Math.min(30, item.abbrs && item.abbrs.split && item.abbrs.split("\n").length * 10, 0);
  }
   if (collection === "ccns") {
    score +=
      (item.groups &&
        item.groups.filter &&
        item.groups.filter(group => group.selection && group.selection.length).length * 8) ||
      0;
  }
  if (collection === "themes") {
    score += Math.min(70, refs * 10);
    score += item.subTitle ? 20 : 0;
    score += item.intro ? 20 : 0;
  }
  if (collection === "reponses") {
    score += Math.min(50, refs * 10);
    score +=  Math.min(50, variants * 10);
    score += item.markdown ? Math.min(40, item.markdown.length * 5) : 0;

    score += item.subTitle ? 20 : 0;
    score += item.intro ? 20 : 0;
  }

  return Math.min(100, Math.max(0, score));
};

export default getScore;
