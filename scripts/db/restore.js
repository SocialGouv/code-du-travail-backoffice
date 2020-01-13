require("colors");
const dotenv = require("dotenv");
const shell = require("shelljs");

dotenv.config({ path: `${__dirname}/../../.env` });
const { POSTGRES_DB, POSTGRES_KINTO_DB, POSTGRES_USER } = process.env;

if (process.argv[2] === undefined) {
  shell.echo(`[script/db/restore] Error: You must give the dumps timestamp in non-dev mode.`.red);

  shell.exit(1);
}

const LABEL = process.argv[2] === "--dev" ? "snapshot" : process.argv[2];

const BACKUPS_DIRECTORY = process.argv[2] === "--dev" ? "./db" : "./backups";
const DB_SERVICE_NAME = "db";
const MAIN_DB_FILENAME = `${LABEL}_${POSTGRES_DB}.dump`;
const KINTO_DB_FILENAME = `${LABEL}_${POSTGRES_KINTO_DB}.dump`;

if (!shell.which("docker")) {
  shell.echo("[script/db/restore] Error: Sorry, this script requires docker.".red);

  shell.exit(1);
}
if (!shell.which("docker-compose")) {
  shell.echo("[script/db/restore] Error: Sorry, this script requires docker-compose.".red);

  shell.exit(1);
}

try {
  const output = shell.exec(`docker-compose ps -q ${DB_SERVICE_NAME}`);
  const dockerDbContainerId = output.stdout.trim();
  shell.exec(`docker cp ${BACKUPS_DIRECTORY}/${MAIN_DB_FILENAME} ${dockerDbContainerId}:/ `);
  shell.exec(`docker cp ${BACKUPS_DIRECTORY}/${KINTO_DB_FILENAME} ${dockerDbContainerId}:/ `);

  let start = `docker-compose exec -T ${DB_SERVICE_NAME} pg_restore -ae --disable-triggers -d ${POSTGRES_DB} -j 8 -U ${POSTGRES_USER}`;
  let end = `/${MAIN_DB_FILENAME}`;
  shell.exec(`${start} -N public ${end}`);
  shell.exec(`${start} -n public -t users_agreements ${end}`);

  shell.exec(
    `docker-compose exec -T ${DB_SERVICE_NAME} pg_restore -Ce -d postgres -U ${POSTGRES_USER} /${KINTO_DB_FILENAME}`
  );
  shell.exec(`docker-compose exec -T ${DB_SERVICE_NAME} rm /${MAIN_DB_FILENAME}`);
  shell.exec(`docker-compose exec -T ${DB_SERVICE_NAME} rm /${KINTO_DB_FILENAME}`);
} catch (err) {
  shell.echo(`[script/db/restore] Error: ${err.message}`.red);

  shell.exit(1);
}
