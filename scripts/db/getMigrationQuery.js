const { readFileSync } = require("fs");

const migrationsPath = `${process.cwd()}/db/migrations`;

class MigrationQuery {
  constructor(migrationName) {
    const filePath = `${migrationsPath}/${migrationName}.sql`;
    const sqlSource = readFileSync(filePath, "utf8");

    this.queries = sqlSource
      .split(/-+ DOWN -+/)
      .map((s, i) => (i === 0 ? s.replace(/-+ UP -+/, "") : s));
  }

  up() {
    return this.queries[0];
  }

  down() {
    return this.queries[1];
  }
}

module.exports = migrationName => new MigrationQuery(migrationName);
