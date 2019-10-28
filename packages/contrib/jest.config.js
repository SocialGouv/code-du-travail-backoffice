module.exports = {
  collectCoverage: true,
  // https://github.com/facebook/jest/issues/7331
  // collectCoverageFrom: ["<rootDir>/src/**/*.js"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|woff2)$": "<rootDir>/__mocks__/fileTransformer.js",
    "\\.css$": "identity-obj-proxy"
  },
  modulePathIgnorePatterns: [
    "<rootDir>/__tests__",
    "<rootDir>/.next",
    "<rootDir>/node_modules",
    // Page components should be tested in e2e:
    "<rootDir>/pages",
    "<rootDir>/server",
    "<rootDir>/src/actions",
    "<rootDir>/src/reducers",
    "<rootDir>/src/sagas",
    "<rootDir>/src/constants.js",
    "<rootDir>/src/store.js",
    "<rootDir>/src/texts.js"
  ],
  // https://github.com/facebook/create-react-app/issues/2007#issuecomment-296694661
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  snapshotSerializers: ["jest-emotion"]
};
