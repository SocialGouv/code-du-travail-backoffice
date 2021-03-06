const { writeFileSync } = require("fs");

const now = new Date().toISOString().replace(/[-T:]|\..*/g, "");

const migrationsPath = `${process.cwd()}/db/migrations`;
const fileName = `${now}_${process.argv[2]}`;

const knexFileSource = `const getMigrationQuery = require("../../../scripts/db/getMigrationQuery");

exports.up = async knex => {
  await knex.raw(getMigrationQuery("${fileName}").up());
};

exports.down = async knex => {
  await knex.raw(getMigrationQuery("${fileName}").down());
};
`;

const sqlFileSource = `-------------------------------------- UP --------------------------------------



------------------------------------- DOWN -------------------------------------


`;

const options = { flag: "wx" };
writeFileSync(`${migrationsPath}/knex/${fileName}.js`, knexFileSource, options);
writeFileSync(`${migrationsPath}/${fileName}.sql`, sqlFileSource, options);
