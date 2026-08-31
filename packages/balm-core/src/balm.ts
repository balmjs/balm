import { BalmConfig, BalmCustomConfig, BundlerType } from './types/index.js';
import { resolveConfig } from './config/index.js';
import { TaskDAG } from './runner/dag.js';
import { BalmHooks } from './hooks/index.js';
import { CleanTask } from './tasks/clean.js';
import { StyleTask } from './tasks/style.js';
import { ScriptTask } from './tasks/script.js';
import { HtmlTask } from './tasks/html.js';
import { CacheTask } from './tasks/cache.js';
import { PwaTask } from './tasks/pwa.js';
import { ServerTask } from './tasks/server.js';
import { StaticTask } from './tasks/static.js';
import { logger } from './utilities/logger.js';

export class Balm {
  private _config: BalmConfig;
  private dag = new TaskDAG();
  beforeTask?: () => Promise<void> | void;
  afterTask?: () => Promise<void> | void;
  readonly Bundler = BundlerType;

  constructor() {
    this._config = resolveConfig();
  }

  get config(): BalmConfig {
    return this._config;
  }
  set config(customConfig: BalmCustomConfig) {
    this._config = resolveConfig(customConfig);
    if (this._config.logs?.level !== undefined) {
      logger.level = this._config.logs.level;
    }
  }

  async go(recipe?: (mix: BalmHooks) => void): Promise<void> {
    const endTimer = logger.time('Build');
    const taskSequence: string[] = [];

    // Register built-in tasks
    this.dag.registerTask(new CleanTask());
    this.dag.registerTask(new StyleTask());
    this.dag.registerTask(new ScriptTask());
    this.dag.registerTask(new StaticTask());
    this.dag.registerTask(new HtmlTask());
    this.dag.registerTask(new CacheTask());
    this.dag.registerTask(new PwaTask());
    this.dag.registerTask(new ServerTask());

    // Run recipe hooks
    if (typeof recipe === 'function') {
      const hooks = new BalmHooks(this.dag, this._config);
      recipe(hooks);
    }

    try {
      if (this.beforeTask) {
        await this.beforeTask();
      }

      if (this._config.useDefaults) {
        await this.dag.runSeries(
          ['clean', 'style', 'script', 'static', 'html'],
          this._config
        );
      }

      // Execute recipe tasks
      for (let i = 1; ; i++) {
        const recipeName = `recipe:${i}`;
        if (!this.dag.hasTask(recipeName)) break;
        await this.dag.executeTask(recipeName, this._config);
      }

      // Post-recipe tasks: cache, pwa, serve
      if (this._config.useDefaults) {
        if (this._config.env.isProd) {
          if (this._config.assets.cache) {
            await this.dag.executeTask('cache', this._config);
          }
          if (this._config.pwa.enabled) {
            await this.dag.executeTask('pwa', this._config);
          }
        } else {
          await this.dag.executeTask('serve', this._config);
        }
      }

      if (this.afterTask) {
        await this.afterTask();
      }

      endTimer();
    } catch (err: any) {
      logger.error('build', `Build failed: ${err?.message || err}`);
      throw err;
    }
  }

  reset(): void {
    this.dag.clear();
    this.beforeTask = undefined;
    this.afterTask = undefined;
    this._config = resolveConfig();
  }
}

export const balm = new Balm();
