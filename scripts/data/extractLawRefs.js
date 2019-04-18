const fs = require("fs")

const data = require("./code-du-travail-20190101.json")

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#Polyfill
if (!Array.prototype.flat) {
  Array.prototype.flat = function() {
    var depth = arguments[0];
    depth = depth === undefined ? 1 : Math.floor(depth);
    if (depth < 1) return Array.prototype.slice.call(this);
    return (function flat(arr, depth) {
      var len = arr.length >>> 0;
      var flattened = [];
      var i = 0;
      while (i < len) {
        if (i in arr) {
          var el = arr[i];
          if (Array.isArray(el) && depth > 0)
            flattened = flattened.concat(flat(el, depth - 1));
          else flattened.push(el);
        }
        i++;
      }
      return flattened;
    })(this, depth);
  };
}

function getArticleNum(child) {
  return child.type === "section"
    ? child.children.map(getArticleNum)
    : child.data.num
}

console.log(typeof data.children.slice(0, 2).map(getArticleNum));

const lawRefs = data.children
  .slice(0, 2)
  .map(getArticleNum)
  .flat(Infinity)
  // Remove strange L1, L2, L3 & Annexes... results.
  .filter(ref => ref.length > 2 && /^[DRL]/.test(ref))

fs.writeFileSync(
  `${__dirname}/../../packages/contrib/static/data/labor-law-references.json`,
  JSON.stringify(lawRefs, null, 2)
)
