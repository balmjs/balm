import { cac } from 'cac';
import path from 'node:path';
import fs from 'node:fs';
import pc from 'picocolors';
import balm, { setWorkspaces } from 'balm-core';
import { resolveBalmCore } from './resolver.js';

const cli = cac('balm');

function applyCliServerOptions(
  customConfig: Record<string, any>,
  options: { host?: string | boolean; port?: string | number }
): Record<string, any> {
  const serverOverrides: Record<string, any> = {};
  if (options.host !== undefined) {
    serverOverrides.host = options.host;
  }
  if (options.port !== undefined) {
    const parsedPort = Number(options.port);
    if (Number.isInteger(parsedPort) && parsedPort > 0) {
      serverOverrides.port = parsedPort;
    }
  }

  if (Object.keys(serverOverrides).length > 0) {
    customConfig.server = {
      ...customConfig.server,
      ...serverOverrides
    };
  }
  return customConfig;
}

cli
  .command('[config]', 'Run Balm build workflow')
  .allowUnknownOptions()
  .option('-p, --prod', 'Production mode')
  .option('-d, --dev', 'Development mode')
  .option('-c, --config <file>', 'Custom config file')
  .option('--host [host]', 'Expose dev server to network (e.g. --host or --host 0.0.0.0)')
  .option('--port <port>', 'Specify dev server port')
  .action(async (configPath, options) => {
    const rawConfigPath = options.config || configPath || 'balm.config.js';
    const fullConfigPath = path.resolve(process.cwd(), rawConfigPath);

    if (options.prod) process.env.NODE_ENV = 'production';
    if (options.dev) process.env.NODE_ENV = 'development';

    const workspace = process.cwd();
    setWorkspaces(workspace, path.resolve(workspace, '..'));

    const balmInstance = await resolveBalmCore(workspace);

    if (fs.existsSync(fullConfigPath)) {
      const imported = await import(fullConfigPath);
      const userConfig = imported.default || imported;

      let configObj = userConfig;
      if (typeof userConfig === 'function') {
        configObj = await userConfig(balmInstance);
      }

      if (configObj && typeof configObj === 'object') {
        const customConfig = configObj.config || configObj;
        if (!customConfig.workspace) {
          customConfig.workspace = workspace;
        }
        balmInstance.config = applyCliServerOptions(customConfig, options);
        if (configObj.beforeTask) {
          balmInstance.beforeTask = configObj.beforeTask;
        }
        if (configObj.afterTask) {
          balmInstance.afterTask = configObj.afterTask;
        }
        const recipeFn = configObj.recipes || configObj.api;
        await balmInstance.go(recipeFn);
      } else {
        const fallbackConfig = applyCliServerOptions({ workspace }, options);
        if (fallbackConfig.server) {
          balmInstance.config = fallbackConfig;
        }
        await balmInstance.go();
      }
    } else {
      console.log(pc.yellow(`No config file found at ${fullConfigPath}, using defaults.`));
      const fallbackConfig = applyCliServerOptions({ workspace }, options);
      if (fallbackConfig.server) {
        balmInstance.config = fallbackConfig;
      }
      await balmInstance.go();
    }
  });

function getCliVersion(): string {
  try {
    const pkgPath = new URL('../package.json', import.meta.url);
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

cli.help();
cli.version(getCliVersion());

cli.parse();
