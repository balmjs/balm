import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import pc from 'picocolors';

const BALM_CORE_PACKAGE = 'balm-core';

export function getGlobalNodeModules(): string[] {
  const globalPaths: string[] = [];

  // 1. Env override
  if (process.env.BALM_CORE) {
    globalPaths.push(process.env.BALM_CORE);
  }

  // 2. Standard global npm / pnpm / yarn paths
  try {
    const npmRoot = execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (npmRoot) globalPaths.push(path.join(npmRoot, BALM_CORE_PACKAGE));
  } catch {
    // ignore
  }

  try {
    const pnpmRoot = execSync('pnpm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (pnpmRoot) globalPaths.push(path.join(pnpmRoot, BALM_CORE_PACKAGE));
  } catch {
    // ignore
  }

  // 3. Platform default fallback locations
  const isWindows = process.platform === 'win32';
  if (isWindows && process.env.APPDATA) {
    globalPaths.push(path.join(process.env.APPDATA, 'npm', 'node_modules', BALM_CORE_PACKAGE));
  } else {
    globalPaths.push(
      `/usr/local/lib/node_modules/${BALM_CORE_PACKAGE}`,
      `/opt/homebrew/lib/node_modules/${BALM_CORE_PACKAGE}`,
      `${process.env.HOME}/.config/yarn/global/node_modules/${BALM_CORE_PACKAGE}`
    );
  }

  return globalPaths;
}

export async function resolveBalmCore(workspace = process.cwd()): Promise<any> {
  // 1. Check local node_modules
  const localBalmCore = path.join(workspace, 'node_modules', BALM_CORE_PACKAGE);
  if (fs.existsSync(localBalmCore)) {
    const modulePath = path.join(localBalmCore, 'dist', 'index.js');
    if (fs.existsSync(modulePath)) {
      return (await import(modulePath)).default;
    }
  }

  // 2. Check workspace resolution / direct import
  try {
    const directImport = await import('balm-core');
    if (directImport) return directImport.default || directImport;
  } catch {
    // fall through to global
  }

  // 3. Check global paths
  const globalPaths = getGlobalNodeModules();
  for (const p of globalPaths) {
    if (fs.existsSync(p)) {
      const modulePath = path.join(p, 'dist', 'index.js');
      if (fs.existsSync(modulePath)) {
        return (await import(modulePath)).default;
      }
    }
  }

  console.error(
    pc.bgBlue(pc.black(' BalmJS ')),
    pc.red(`\`${BALM_CORE_PACKAGE}\` is not found!`),
    pc.yellow('\nPlease install it globally:\n  npm install -g balm-core\n  # or pnpm add -g balm-core\n')
  );
  process.exit(1);
}
