module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/packages/api/src/**/*.js",
    "<rootDir>/packages/app/server/**/*.js",
    "<rootDir>/packages/app/src/**/*.js",
  ],
  coverageDirectory: "<rootDir>/coverage",
  projects: ["<rootDir>/packages/*/jest.config.js"],
};
