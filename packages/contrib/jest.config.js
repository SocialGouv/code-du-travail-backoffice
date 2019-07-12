/* eslint-disable max-len */

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.js"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|woff2)$":
      "<rootDir>/__mocks__/fileTransformer.js",
    "\\.css$": "identity-obj-proxy"
  },
  modulePathIgnorePatterns: [
    "<rootDir>/__tests__",
    "<rootDir>/.next",
    "<rootDir>/node_modules",
    "<rootDir>/package.json",
    // Page components should be tested in e2e:
    "<rootDir>/pages",
    "<rootDir>/server",
    "<rootDir>/src/actions",
    "<rootDir>/src/reducers",
    "<rootDir>/src/sagas",
    "<rootDir>/yarn.lock"
  ],
  // https://github.com/facebook/create-react-app/issues/2007#issuecomment-296694661
  setupFilesAfterEnv: ["<rootDir>/__tests__/jest.setup.js"]
};
