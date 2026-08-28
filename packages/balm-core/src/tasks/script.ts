import { BaseTask } from '../runner/task.js';
import { BalmConfig, BundlerType } from '../types/index.js';
import { runWebpack } from '../bundler/webpack.js';
import { runRollup } from '../bundler/rollup.js';
import { runEsbuild } from '../bundler/esbuild.js';

export class ScriptTask extends BaseTask {
  constructor() {
    super({ name: 'script', description: 'Bundle JavaScript/TypeScript' });
  }

  async run(config: BalmConfig): Promise<void> {
    const bundler = config.scripts.bundler;

    switch (bundler) {
      case BundlerType.rollup:
        await runRollup(config);
        break;
      case BundlerType.esbuild:
        await runEsbuild(config);
        break;
      case BundlerType.webpack:
      default:
        await runWebpack(config);
        break;
    }
  }
}
