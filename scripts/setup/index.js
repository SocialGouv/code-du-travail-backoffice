const crypto = require("crypto");
const dotenv = require("dotenv");
const fs = require("fs");
const ora = require("ora");
const { promisify } = require("util");

const migrateDb = require("./migrateDb");
const seedDb = require("./seedDb");
const runDockerCompose = require("./runDockerCompose");

const ROOT = `${__dirname}/../..`;
const envPath = `${ROOT}/.env`;
const sampleEnvPath = `${ROOT}/.env.sample`;

const randomBytesP = promisify(crypto.randomBytes);
const readFileP = promisify(fs.readFile);
const writeFileP = promisify(fs.writeFile);

const spinner = ora();

function waitFor(timeInMs) {
  return new Promise(resolve => setTimeout(resolve, timeInMs));
}

async function install() {
  // Copy and fill .env file (if it doesn't already exist)
  if (!fs.existsSync(envPath)) {
    spinner.start(`Generating .env file...`);

    const sampleEnvBuffer = await readFileP(sampleEnvPath);
    const sampleEnvConfig = dotenv.parse(sampleEnvBuffer);
    const envConfig = {
      ...sampleEnvConfig,
      PGRST_JWT_SECRET: (await randomBytesP(32)).toString("base64")
    };
    const envSource = Object.entries(envConfig).reduce(
      (acc, kvPair) => `${acc}${kvPair[0]}=${kvPair[1]}\n`,
      ""
    );
    await writeFileP(envPath, envSource);

    spinner.succeed(`Local .env file generated.`);
  }

  if (process.argv[2] === "--env-only") return

  // Start Docker Compose
  spinner.start(`Starting a new "db" container...`);
  const dockerCp2 = await runDockerCompose("up", "db", () => {
    spinner.succeed(`The "db" container is stopped.`);

    process.exit(0);
  });
  spinner.succeed(`The "db" container is up and runnning.`);

  // Migrate Postgre structure
  spinner.start(`Migrating PostgreSQL structure...`);
  await migrateDb(ROOT);
  spinner.succeed(`PostgreSQL structure migrated.`);

  // Seed Postgre database
  spinner.start(`Seeding PostgreSQL database...`);
  await seedDb(ROOT);
  spinner.succeed(`PostgreSQL database seeded.`);

  spinner.start(`Stopping "db" container...`);
  runDockerCompose("stop", "db");
}

install();
