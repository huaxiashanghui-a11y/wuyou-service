#!/usr/bin/env node
const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

function log(msg) {
  console.error(msg);
}

function createSecureLogFile() {
  const tmpDir = path.join(process.cwd(), '.vercel-tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  return path.join(tmpDir, 'login.log');
}

const LOG_FILE = createSecureLogFile();

function startBackgroundLogin() {
  const logStream = fs.openSync(LOG_FILE, 'w');
  const child = spawn('vercel', ['login'], {
    detached: true,
    stdio: ['ignore', logStream, logStream],
    shell: true
  });
  child.unref();
  return child.pid;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForAuthUrl() {
  for (let i = 0; i < 40; i++) {
    await sleep(500);
    try {
      if (fs.existsSync(LOG_FILE)) {
        const content = fs.readFileSync(LOG_FILE, 'utf8');
        const match = content.match(/https:\/\/vercel\.com\/oauth\/device\?user_code=[A-Z0-9-]+(?=\s|$)/);
        if (match) {
          return match[0];
        }
      }
    } catch (e) {
      // Ignore
    }
  }
  return null;
}

async function main() {
  log('Starting login authorization...');
  const loginPid = startBackgroundLogin();
  log(`Background login started (PID: ${loginPid})`);
  
  const authUrl = await waitForAuthUrl();
  if (authUrl) {
    console.log(JSON.stringify({ status: 'needs_auth', auth_url: authUrl }));
  } else {
    log('Failed to get auth URL');
    process.exit(1);
  }
}

main();
