const pack = require("./package");

module.exports = {
  displayName: pack.name,
  modulePathIgnorePatterns: [
    "<rootDir>/.next",
    "<rootDir>/node_modules",
    // Page components should be tested in e2e:
    "<rootDir>/pages"
  ]
};
