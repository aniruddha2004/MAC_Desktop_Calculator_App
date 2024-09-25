const { exec } = require('child_process');

// Start the server
const serverProcess = exec('node server.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Server error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Server stderr: ${stderr}`);
    return;
  }
  console.log(`Server stdout: ${stdout}`);
});

// Start the Electron app
const electronProcess = exec('electron .', (error, stdout, stderr) => {
  if (error) {
    console.error(`Electron error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Electron stderr: ${stderr}`);
    return;
  }
  console.log(`Electron stdout: ${stdout}`);
});

// Close both processes on exit
process.on('exit', () => {
  serverProcess.kill();
  electronProcess.kill();
});
