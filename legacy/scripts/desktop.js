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
  BROWSER: 'none',
  REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:4000/api',
};

const electronEnv = {
  ...process.env,
  NODE_ENV: 'development',
  LIFEQUEST_DESKTOP_URL: process.env.LIFEQUEST_DESKTOP_URL ?? 'http://localhost:3000',
};

const processes = [];

const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: backendDir,
  env: backendEnv,
  stdio: 'inherit',
});
processes.push(backend);

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
processes.push(frontend);

frontend.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Frontend process exited with code ${code}`);
    process.exitCode = code ?? 1;
  }
  shutdown();
});

let electronStarted = false;
const maybeStartElectron = () => {
  if (electronStarted) return;
  electronStarted = true;
  const electron = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['electron', path.join(projectRoot, 'electron', 'main.js')],
    {
      cwd: projectRoot,
      env: electronEnv,
      stdio: 'inherit',
    }
  );
  processes.push(electron);
  electron.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Electron exited with code ${code}`);
      process.exitCode = code ?? 1;
    }
    shutdown();
  });
};

// Give CRA dev server a few seconds to boot before launching Electron.
setTimeout(maybeStartElectron, Number(process.env.LIFEQUEST_ELECTRON_DELAY ?? 8000));

const shutdown = () => {
  processes.forEach((proc) => {
    if (!proc.killed) {
      proc.kill('SIGINT');
    }
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
