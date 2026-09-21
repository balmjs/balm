import { cac } from 'cac';
import path from 'node:path';
import fs from 'node:fs';
import pc from 'picocolors';
import balm, { setWorkspaces } from 'balm-core';
import { resolveBalmCore } from './resolver.js';

const cli = cac('balm');

cli
  .command('[config]', 'Run Balm build workflow')
  .allowUnknownOptions()
  .option('-p, --prod', 'Production mode')
  .option('-d, --dev', 'Development mode')
  .option('-c, --config <file>', 'Custom config file')
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
        balmInstance.config = customConfig;
        if (configObj.beforeTask) {
          balmInstance.beforeTask = configObj.beforeTask;
        }
        if (configObj.afterTask) {
          balmInstance.afterTask = configObj.afterTask;
        }
        const recipeFn = configObj.recipes || configObj.api;
        await balmInstance.go(recipeFn);
      } else {
        await balmInstance.go();
      }
    } else {
      console.log(pc.yellow(`No config file found at ${fullConfigPath}, using defaults.`));
      await balmInstance.go();
    }
  });

cli.help();
cli.version('6.0.0-alpha.2');

cli.parse();
