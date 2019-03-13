module.exports = {
  collectCoverageFrom: ["<rootDir>/pages/**/*.js", "<rootDir>/src/**/*.js"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|woff2)$":
      "<rootDir>/__mocks__/fileTransformer.js",
    "\\.css$": "identity-obj-proxy"
  },
  modulePathIgnorePatterns: [
    "<rootDir>/__tests__/",
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/package.json",
    "<rootDir>/yarn.lock"
  ],
  setupFiles: ["<rootDir>/__tests__/jest.setup.js"]
};
