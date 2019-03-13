const { spawn } = require("child_process");

module.exports = async (action, imageName, onExit) => {
  return new Promise(resolve => {
    // Attempt to run docker-compose (for api image) in a child process
    const args = action === "up"
      ? ["up", "--force-recreate", imageName]
      : [action, imageName];
    const cp = spawn("docker-compose", args, { cwd: process.cwd() });

    cp.stdout.on("data", buff => {
      const output = String(buff);

      if (action === "up" && imageName === "db") {
        if (/database system is ready to accept connections/.test(output)) {
          resolve(cp);
        }

        if (/db_\d+ exited with code/.test(output)) {
          cp.kill("SIGINT");
        }
      }
    });

    cp.stderr.on("data", buff => {
      // console.log(`Error: ${buff}`);
    });

    cp.on("close", code => {
      if (code !== null && code !== 0) {
        console.log(`Error: Docker Compose child process exited with ${code}.`);
      }

      if (onExit !== undefined) onExit();
    });
  });
};
