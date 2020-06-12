const pack = require("./package");

module.exports = {
  bail: 1,
  clearMocks: true,
  displayName: pack.name,
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|woff2)$":
      "<rootDir>/packages/app/tests/mappers/fileTransformer.js",
    "\\.css$": "identity-obj-proxy",
  },
  rootDir: "../..",
  roots: [`<rootDir>/packages/app`],
  // https://github.com/facebook/create-react-app/issues/2007#issuecomment-296694661
  setupFilesAfterEnv: ["<rootDir>/packages/app/tests/jest.setup.js"],
  snapshotSerializers: ["jest-emotion"],
  watchPathIgnorePatterns: ["<rootDir>/packages/app/.next/"],
};
