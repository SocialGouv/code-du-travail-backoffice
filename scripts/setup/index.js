const crypto = require('crypto')
const dotenv = require('dotenv')
const fs = require('fs')
const ora = require('ora')
const { promisify } = require('util')

const migrateDb = require('./migrateDb')
const seedDb = require('./seedDb')
const runDockerCompose = require('./runDockerCompose')

const ROOT = `${__dirname}/../..`
const envPath = `${ROOT}/.env`
const sampleEnvPath = `${ROOT}/.env.sample`

const randomBytesP = promisify(crypto.randomBytes)
const readFileP = promisify(fs.readFile)
const writeFileP = promisify(fs.writeFile)

const spinner = ora()

function waitFor(timeInMs) {
  return new Promise(resolve => setTimeout(resolve, timeInMs))
}

async function install() {
  // Copy and fill .env file (if it doesn't already exist)
  if (!fs.existsSync(envPath)) {
    spinner.start(`Generating .env file...`)

    const sampleEnvBuffer = await readFileP(sampleEnvPath)
    const sampleEnvConfig = dotenv.parse(sampleEnvBuffer)
    const envConfig = {
      ...sampleEnvConfig,
      PGRST_JWT_SECRET: (await randomBytesP(32)).toString('base64')
    }
    const envSource = Object
    .entries(envConfig)
    .reduce((acc, kvPair) => `${acc}${kvPair[0]}=${kvPair[1]}\n`, '')
    await writeFileP(envPath, envSource)

    spinner.succeed(`Local .env file generated.`)
  }

  // Start Docker Compose
  spinner.start(`Starting Docker Compose child process...`)
  let isDockerCpRunning = false
  const dockerCp = await runDockerCompose(() => isDockerCpRunning = false)
  isDockerCpRunning = false
  spinner.succeed(`Docker Compose images are up and runnning.`)

  // Migrate Postgre structure
  spinner.start(`Migrating Postgre structure...`)
  await migrateDb(ROOT)
  spinner.succeed(`Postgre structure migrated.`);

  // Seed Postgre database
  spinner.start(`Seeding Postgre database...`)
  await seedDb(ROOT)
  spinner.succeed(`Postgre database seeded.`)

  spinner.start(`Stopping Docker Compose child process...`)
  dockerCp.kill('SIGINT')
  while (isDockerCpRunning) await waitFor(500)
  spinner.succeed(`Docker Compose child process stopped.`)

  process.exit(0)
}

install()
