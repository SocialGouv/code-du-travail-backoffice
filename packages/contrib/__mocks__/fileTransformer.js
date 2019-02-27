const path = require("path");

// https://jestjs.io/docs/en/webpack#mocking-css-modules
module.exports = {
  // eslint-disable-next-line no-unused-vars
  process: (src, filename, config, options) => {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`;
  }
};
