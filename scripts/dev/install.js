const crypto = require('crypto')
const dotenv = require('dotenv')
const fs = require('fs')
const { promisify } = require('util')

const ROOT = `${__dirname}/../..`
const envPath = `${ROOT}/.env`
const sampleEnvPath = `${ROOT}/.env.sample`

const randomBytesP = promisify(crypto.randomBytes)
const readFileP = promisify(fs.readFile)
const writeFileP = promisify(fs.writeFile)

async function install() {
  // Copy and fill .env file (if it doesn't already exist)
  if (!fs.existsSync(envPath)) {
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
  }
}

install()
