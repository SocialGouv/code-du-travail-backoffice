const fs = require("fs");

const { NODE_ENV } = process.env;
if (NODE_ENV !== "production") process.exit(0);

const packageJsonPath = `${process.cwd()}/package.json`;
const pack = require(packageJsonPath);
delete pack.workspaces;
const newPackageJson = JSON.stringify(pack, null, 2);
fs.writeFileSync(packageJsonPath, newPackageJson);
