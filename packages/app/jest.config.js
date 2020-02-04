const pack = require("./package");

module.exports = {
  displayName: pack.name,
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|woff2)$": "<rootDir>/tests/mappers/fileTransformer.js",
    "\\.css$": "identity-obj-proxy"
  },
  modulePathIgnorePatterns: [
    "<rootDir>/.next",
    "<rootDir>/node_modules",
    "<rootDir>/tests",
    // Page components should be tested in e2e:
    "<rootDir>/pages",
    "<rootDir>/server"
  ],
  // https://github.com/facebook/create-react-app/issues/2007#issuecomment-296694661
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.js"],
  snapshotSerializers: ["jest-emotion"]
};
