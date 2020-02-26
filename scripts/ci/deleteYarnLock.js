const fs = require("fs");

const { NODE_ENV } = process.env;
if (NODE_ENV !== "production") process.exit(0);

const yarnLockPath = `${process.cwd()}/yarn.lock`;
fs.unlinkSync(yarnLockPath);
