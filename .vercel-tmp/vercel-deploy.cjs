#!/usr/bin/env node
/**
 * Vercel CLI Deployment Script (Cross-Platform)
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isWindows = os.platform() === 'win32';

const ALLOWED_COMMANDS = new Set(['vercel', 'npm', 'pnpm', 'yarn']);

function log(msg) {
  console.error(msg);
}

function commandExists(cmd) {
  if (!ALLOWED_COMMANDS.has(cmd)) {
    throw new Error(`Command not in whitelist: ${cmd}`);
  }
  try {
    if (isWindows) {
      const result = spawnSync('where', [cmd], { stdio: 'ignore' });
      return result.status === 0;
    } else {
      const result = spawnSync('sh', ['-c', `command -v "$1"`, '--', cmd], { stdio: 'ignore' });
      return result.status === 0;
    }
  } catch {
    return false;
  }
}

function getCommandOutput(cmd, args) {
  try {
    const result = spawnSync(cmd, args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], shell: isWindows });
    return result.status === 0 ? (result.stdout || '').trim() : null;
  } catch {
    return null;
  }
}

function checkVercelInstalled() {
  if (!commandExists('vercel')) {
    log('Error: Vercel CLI is not installed');
    process.exit(1);
  }
  const version = getCommandOutput('vercel', ['--version']) || 'unknown';
  log(`Vercel CLI version: ${version}`);
}

function checkLoginStatus() {
  log('Checking login status...');
  try {
    const result = spawnSync('vercel', ['whoami'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], shell: isWindows });
    const output = (result.stdout || '').trim();
    if (result.status === 0 && output && !output.includes('Error') && !output.includes('not logged in')) {
      log(`Logged in as: ${output}`);
      return true;
    }
  } catch {}
  return false;
}

function detectPackageManager(projectPath) {
  if (fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(projectPath, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(projectPath, 'package-lock.json'))) return 'npm';
  if (commandExists('pnpm')) return 'pnpm';
  if (commandExists('yarn')) return 'yarn';
  if (commandExists('npm')) return 'npm';
  return null;
}

function runBuild(projectPath) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log('No package.json found, skipping build step');
    return true;
  }

  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } catch (error) {
    log(`Warning: Failed to parse package.json: ${error.message}`);
    return true;
  }

  if (!packageJson.scripts || !packageJson.scripts.build) {
    log('No build script found in package.json, skipping build step');
    return true;
  }

  log('');
  log('========================================');
  log('Running pre-deployment build...');
  log('========================================');
  log('');

  const pkgManager = detectPackageManager(projectPath);
  if (!pkgManager) {
    log('Error: No package manager found');
    process.exit(1);
  }
  log(`Using package manager: ${pkgManager}`);

  const nodeModulesPath = path.join(projectPath, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    log('node_modules not found, installing dependencies first...');
    const installArgs = pkgManager === 'yarn' ? [] : ['install'];
    try {
      const result = spawnSync(pkgManager, installArgs, {
        cwd: projectPath,
        stdio: 'inherit',
        shell: isWindows
      });
      if (result.status !== 0) throw new Error('Install failed');
    } catch (error) {
      log(`Error: Failed to install dependencies`);
      process.exit(1);
    }
  }

  const buildArgs = pkgManager === 'npm' ? ['run', 'build'] : ['build'];
  log(`Executing: ${pkgManager} ${buildArgs.join(' ')}`);
  log('');

  try {
    const result = spawnSync(pkgManager, buildArgs, {
      cwd: projectPath,
      stdio: 'inherit',
      shell: isWindows
    });
    if (result.status !== 0) throw new Error('Build failed');
    log('');
    log('========================================');
    log('Build completed successfully!');
    log('========================================');
    return true;
  } catch (error) {
    log('');
    log('========================================');
    log('Build FAILED!');
    log('========================================');
    process.exit(1);
  }
}

function doDeploy(projectPath) {
  log('');
  log('Starting deployment...');
  log('Deployment environment: Production (Public)');
  log('');
  log('========================================');

  try {
    const result = spawnSync('vercel', ['--prod', '--yes'], {
      cwd: projectPath,
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe'],
      timeout: 300000,
      shell: isWindows
    });

    const output = (result.stdout || '') + (result.stderr || '');
    log(output);

    // Extract URLs
    const aliasedMatch = output.match(/Aliased:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
    const productionUrl = aliasedMatch ? aliasedMatch[1] : null;
    const deploymentMatch = output.match(/Production:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
    const deploymentUrl = deploymentMatch ? deploymentMatch[1] : null;
    const finalUrl = productionUrl || deploymentUrl;

    log('');
    log('========================================');
    log('Deployment successful!');
    log('========================================');
    log('');

    if (finalUrl) {
      log(`Your site is live! Visit: ${finalUrl}`);
      console.log(JSON.stringify({ status: 'success', url: finalUrl }));
    } else {
      console.log(JSON.stringify({ status: 'success', message: 'Deployment successful' }));
    }
  } catch (error) {
    log(error.message || '');
    log('Deployment failed');
    process.exit(1);
  }
}

function main() {
  log('========================================');
  log('Vercel CLI Project Deployment');
  log('========================================');
  log('');

  checkVercelInstalled();
  log('');

  if (!checkLoginStatus()) {
    log('');
    log('Error: Not logged in');
    log('Please run login script first to authorize');
    process.exit(1);
  }

  const projectPath = 'c:\\Users\\Administrator\\Desktop\\wyszbot\\frontend';

  runBuild(projectPath);
  doDeploy(projectPath);
}

main();
