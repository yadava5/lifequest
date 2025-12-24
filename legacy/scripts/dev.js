/* eslint-disable no-console */
const { spawn } = require('child_process');
const path = require('path');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const projectRoot = path.join(__dirname, '..');
const backendDir = path.join(projectRoot, 'backend');

const backendEnv = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL ?? 'file:./dev.db',
};

const frontendEnv = {
  ...process.env,
  REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:4000/api',
};

const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: backendDir,
  env: backendEnv,
  stdio: 'inherit',
});

backend.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Backend process exited with code ${code}`);
    process.exitCode = code ?? 1;
  }
});

const frontend = spawn(npmCmd, ['start'], {
  cwd: projectRoot,
  env: frontendEnv,
  stdio: 'inherit',
});

frontend.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Frontend process exited with code ${code}`);
    process.exitCode = code ?? 1;
  }

  backend.kill();
});

const shutdown = () => {
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  setTimeout(() => process.exit(), 500);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
