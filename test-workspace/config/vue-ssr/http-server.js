const { spawn } = require('child_process');

function serve() {
  const egg = spawn('node', ['vue-ssr/server.js']);

  egg.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  egg.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  egg.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

module.exports = serve;
