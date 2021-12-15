module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest", "only-warn"],
  root: true,
  env: {
    "jest/globals": true,
    browser: true,
    node: true,
  },
};
