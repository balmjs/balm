import { cac } from 'cac';
import path from 'node:path';
import fs from 'node:fs';
import pc from 'picocolors';
import balm from 'balm-core';
import { resolveBalmCore } from './resolver.js';

const cli = cac('balm');

cli
  .command('[config]', 'Run Balm build workflow')
  .option('-p, --prod', 'Production mode')
  .option('-d, --dev', 'Development mode')
  .action(async (configPath = 'balm.config.js', options) => {
    const fullConfigPath = path.resolve(process.cwd(), configPath);

    if (options.prod) process.env.NODE_ENV = 'production';
    if (options.dev) process.env.NODE_ENV = 'development';

    const configDir = fs.existsSync(fullConfigPath)
      ? path.dirname(fullConfigPath)
      : process.cwd();

    const balmInstance = await resolveBalmCore(configDir);

    if (fs.existsSync(fullConfigPath)) {
      const imported = await import(fullConfigPath);
      const userConfig = imported.default || imported;

      if (typeof userConfig === 'function') {
        balmInstance.config = { workspace: configDir };
        userConfig(balmInstance);
      } else if (typeof userConfig === 'object') {
        const customConfig = userConfig.config || userConfig;
        if (!customConfig.workspace) {
          customConfig.workspace = configDir;
        }
        balmInstance.config = customConfig;
        await balmInstance.go(userConfig.recipes);
      }
    } else {
      console.log(pc.yellow(`No config file found at ${fullConfigPath}, using defaults.`));
      await balmInstance.go();
    }
  });

cli.help();
cli.version('6.0.0-alpha.0');

cli.parse();
