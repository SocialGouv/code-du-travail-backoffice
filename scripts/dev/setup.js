require("colors");
const fs = require("fs");
const knex = require("knex");
const shell = require("shelljs");
const { argv } = require("yargs");

const { DEV_DB_PORT, NODE_ENV, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER } = process.env;

if (NODE_ENV === "production") {
  shell.echo(
    "[script/dev/setup] Error: You can't run this script in a production environment!.".red,
  );

  shell.exit(1);
}
if (!shell.which("docker")) {
  shell.echo("[script/dev/setup] Error: Sorry, this script requires docker.".red);

  shell.exit(1);
}
if (!shell.which("docker-compose")) {
  shell.echo("[script/dev/setup] Error: Sorry, this script requires docker-compose.".red);

  shell.exit(1);
}

const DB_URI = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${DEV_DB_PORT}/${POSTGRES_DB}`;

const knexClient = knex({
  client: "pg",
  connection: DB_URI,
});

function run(command) {
  shell.echo(`Running: \`${command}\`…`.blue);
  const output = shell.exec(command);
  if (output.code !== 0) shell.exit(1);
}

async function waitForDb() {
  try {
    await knexClient.raw("SELECT 1 + 1 AS result;");
  } catch {
    await waitForDb();
  }
}

(async () => {
  try {
    fs.appendFileSync(".env", "\nNODE_ENV=development\n");
    run(`lerna link`);
    run(`docker-compose down --remove-orphans -v`);
    run(`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d db`);
    shell.echo(`Waiting for db to be up and ready…`.blue);
    await waitForDb();
    run(`yarn db:migrate`);

    if (argv.full) {
      run(`yarn db:seed`);
      run(`yarn db:snapshot:update`);
    } else {
      run(`yarn db:snapshot:restore`);
    }

    run(`yarn dev:docker`);
    run(`docker-compose stop`);
    shell.exit(0);
  } catch (err) {
    shell.echo(`[script/dev/setup] Error: ${err.message}`.red);

    shell.exit(1);
  }
})();
