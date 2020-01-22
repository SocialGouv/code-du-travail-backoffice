require("colors");
const cpy = require("cpy");
const knex = require("knex");
const path = require("path");
const shell = require("shelljs");

const { DB_PUBLIC_URI, NODE_ENV, POSTGRES_DB, POSTGRES_KINTO_DB, POSTGRES_USER } = process.env;

if (NODE_ENV === "production") {
  shell.echo(
    "[script/dev/setup] Error: You can't run this script in a production environment!.".red
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

const knexClient = knex({
  client: "pg",
  connection: DB_PUBLIC_URI
});

function run(command) {
  shell.echo(`Running: \`${command}\`…`.blue);
  const output = shell.exec(command);
  if (output.code !== 0) shell.exit(1);
}

async function waitForDb() {
  try {
    await knexClient.raw("select 1+1 as result");
  } catch {
    await waitForDb();
  }
}

(async () => {
  try {
    await cpy(".env.example", ".", { rename: ".env" });
    run(`docker-compose down --remove-orphans -v`);
    run(`docker-compose up -d db`);
    shell.echo(`Waiting for db to be up and ready…`.blue);
    await waitForDb();
    run(`yarn db:migrate`);
    run(`yarn db:snapshot:restore`);
    run(`docker-compose up -d api kinto`);
    run(`docker-compose stop`);
    shell.exit(0);
  } catch (err) {
    shell.echo(`[script/dev/setup] Error: ${err.message}`.red);

    shell.exit(1);
  }
})();
