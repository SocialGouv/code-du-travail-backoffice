const { spawn } = require('child_process')

module.exports = (onExit) => {
  const isReady = {
    postgre: false,
    server: false,
  }

  // Attempt to run docker-compose in a child process
  return new Promise(resolve => {
    const cp = spawn('docker-compose', ['up'] , { cwd: process.cwd() })

    cp.stdout.on('data', data => {
      if (/postgre.*database system is ready to accept connections/.test(String(data))) {
        isReady.postgre = true
      }
      if (/server.*Connection successful/.test(String(data))) {
        isReady.server = true
      }

      if (isReady.postgre && isReady.server) resolve(cp)
    })

    cp.stderr.on('data', data => {
      // Remove non-error logs that are falsely triggering via `stderr`
      if (/^Creating/.test(String(data))) return
      if (/is up-to-date/.test(String(data))) return
      if (/\s*/.test(String(data))) return

      console.log(`Error: ${data}`)
    })

    cp.on('close', code => {
      if (code !== 0) {
        console.log(`Error: Docker Compose child process exited with ${code}.`)
      }

      onExit()
    })
  })
}
