import { BaseTask } from '../runner/task.js';
import { BalmConfig, BundlerType } from '../types/index.js';
import { runWebpack } from '../bundler/webpack.js';
import { runRollup } from '../bundler/rollup.js';
import {
  createEsbuildRunner,
  EsbuildIncrementalRunner,
  runEsbuild
} from '../bundler/esbuild.js';

export interface ScriptTaskOptions {
  incremental?: boolean;
}

export class ScriptTask extends BaseTask {
  private incremental: boolean;
  private esbuildRunner: EsbuildIncrementalRunner | null = null;
  private esbuildConfigKey: string | null = null;

  constructor(options: ScriptTaskOptions = {}) {
    super({ name: 'script', description: 'Bundle JavaScript/TypeScript' });
    this.incremental = Boolean(options.incremental);
  }

  private getEsbuildConfigKey(config: BalmConfig): string {
    return JSON.stringify({
      workspace: config.workspace,
      outdir: config.dest.js,
      entry: config.scripts.entry,
      alias: config.alias,
      scriptAlias: config.scripts.alias,
      target: config.scripts.target,
      minify: config.env.isProd || config.scripts.minify
    });
  }

  async run(config: BalmConfig): Promise<void> {
    const bundler = config.scripts.bundler;

    switch (bundler) {
      case BundlerType.rollup:
        await runRollup(config);
        break;
      case BundlerType.esbuild:
        if (this.incremental && !config.env.isProd) {
          const nextKey = this.getEsbuildConfigKey(config);
          if (!this.esbuildRunner || this.esbuildConfigKey !== nextKey) {
            await this.dispose();
            this.esbuildRunner = await createEsbuildRunner(config);
            this.esbuildConfigKey = nextKey;
          }
          await this.esbuildRunner.rebuild();
        } else {
          await runEsbuild(config);
        }
        break;
      case BundlerType.webpack:
      default:
        await runWebpack(config);
        break;
    }
  }

  async dispose(): Promise<void> {
    if (this.esbuildRunner) {
      const runner = this.esbuildRunner;
      this.esbuildRunner = null;
      this.esbuildConfigKey = null;
      await runner.dispose();
    }
  }
}
