const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const NODE_ENV = process.env.NODE_ENV !== undefined ? process.env.NODE_ENV : 'development'
const PORT = process.env.PORT !== undefined ? process.env.NODE_ENV : 3000

const app = next({ dev: NODE_ENV !== 'production' })
const handle = app.getRequestHandler()

const server = createServer((req, res) => handle(req, res, parse(req.url, true)))

async function start() {
  await app.prepare()

  server.listen(PORT, err => {
    if (err) throw err

    console.log(`> Ready on http://localhost:${PORT} (${NODE_ENV})`)
  })
}

start()
