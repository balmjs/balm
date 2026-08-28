import {
  CopyTask,
  RemoveTask,
  ReplaceTask,
  PublishTask,
  PwaTask,
  ZipTask,
  FtpTask,
  ServerTask
} from '../tasks/index.js';
import { FunctionTask } from '../runner/task.js';
import { Pipeline } from '../pipeline/pipeline.js';
import { transformSass } from '../pipeline/transforms/sass.js';
import { transformLess } from '../pipeline/transforms/less.js';
import { transformPostcss } from '../pipeline/transforms/postcss.js';
import { runWebpack } from '../bundler/webpack.js';
import { runRollup } from '../bundler/rollup.js';
import { runEsbuild } from '../bundler/esbuild.js';
import { TaskDAG } from '../runner/dag.js';
import {
  RenameOptions,
  ReplaceOptions,
  TemplateOption,
  BalmConfig
} from '../types/index.js';
import { logger } from '../utilities/logger.js';

export class BalmHooks {
  private dag: TaskDAG;
  private recipeIndex = 0;

  constructor(dag: TaskDAG) {
    this.dag = dag;
  }

  private addRecipeTask(fn: (config: BalmConfig) => Promise<void> | void): void {
    this.recipeIndex++;
    const taskName = `recipe:${this.recipeIndex}`;
    this.dag.registerTask(new FunctionTask(taskName, fn));
  }

  copy(
    input: string | string[],
    output: string,
    options: { rename?: RenameOptions | string | Function } = {}
  ): this {
    this.addRecipeTask(async (config) => {
      const task = new CopyTask({ input, output, rename: options.rename });
      await task.run(config);
    });
    return this;
  }

  remove(target: string | string[]): this {
    this.addRecipeTask(async (config) => {
      const task = new RemoveTask(target);
      await task.run(config);
    });
    return this;
  }

  replace(
    input: string | string[],
    output: string,
    options: ReplaceOptions | ReplaceOptions[]
  ): this {
    this.addRecipeTask(async (config) => {
      const task = new ReplaceTask({ input, output, options });
      await task.run(config);
    });
    return this;
  }

  sass(input: string | string[], output: string, options = {}): this {
    this.addRecipeTask(async (config) => {
      const pipeline = Pipeline.from(input, { cwd: config.workspace });
      pipeline.pipe(transformSass(options));
      pipeline.pipe(transformPostcss({ minify: config.env.isProd }));
      await pipeline.dest(output);
    });
    return this;
  }

  less(input: string | string[], output: string, options = {}): this {
    this.addRecipeTask(async (config) => {
      const pipeline = Pipeline.from(input, { cwd: config.workspace });
      pipeline.pipe(transformLess(options));
      pipeline.pipe(transformPostcss({ minify: config.env.isProd }));
      await pipeline.dest(output);
    });
    return this;
  }

  css(input: string | string[], output: string, options = {}): this {
    this.addRecipeTask(async (config) => {
      const pipeline = Pipeline.from(input, { cwd: config.workspace });
      pipeline.pipe(transformPostcss({ minify: config.env.isProd, ...options }));
      await pipeline.dest(output);
    });
    return this;
  }

  webpack(entry?: any, output?: string, customOptions = {}): this {
    this.addRecipeTask(async (config) => {
      await runWebpack(config, {
        ...(entry ? { entry } : {}),
        ...(output ? { output: { path: output } } : {}),
        ...customOptions
      });
    });
    return this;
  }

  rollup(input?: any, output?: any, customInputOptions = {}, customOutputOptions = {}): this {
    this.addRecipeTask(async (config) => {
      await runRollup(
        config,
        { ...(input ? { input } : {}), ...customInputOptions },
        { ...(output ? { dir: output } : {}), ...customOutputOptions }
      );
    });
    return this;
  }

  esbuild(entryPoints?: any, outdir?: string, customOptions = {}): this {
    this.addRecipeTask(async (config) => {
      await runEsbuild(config, {
        ...(entryPoints ? { entryPoints } : {}),
        ...(outdir ? { outdir } : {}),
        ...customOptions
      });
    });
    return this;
  }

  js(input?: any, output?: any, options = {}): this {
    logger.warn('balm api', '`mix.js` is deprecated, please use `mix.webpack`/`mix.rollup`/`mix.esbuild` instead.');
    return this.webpack(input, output, options);
  }

  publish(
    input?: string | TemplateOption[],
    output?: string,
    renameOptions?: string | Function | RenameOptions
  ): this {
    this.addRecipeTask(async (config) => {
      const task = new PublishTask({ input, output, renameOptions });
      await task.run(config);
    });
    return this;
  }

  generateSW(options = {}): this {
    this.addRecipeTask(async (config) => {
      const task = new PwaTask({ mode: 'generateSW', options });
      await task.run(config);
    });
    return this;
  }

  injectManifest(options = {}): this {
    this.addRecipeTask(async (config) => {
      const task = new PwaTask({ mode: 'injectManifest', options });
      await task.run(config);
    });
    return this;
  }

  ftp(localFiles?: string | string[], options = {}): this {
    this.addRecipeTask(async (config) => {
      const task = new FtpTask({ localFiles, options });
      await task.run(config);
    });
    return this;
  }

  zip(input?: string | string[], output?: string, filename?: string): this {
    this.addRecipeTask(async (config) => {
      const task = new ZipTask({ input, output, filename });
      await task.run(config);
    });
    return this;
  }

  serve(): this {
    this.addRecipeTask(async (config) => {
      const task = new ServerTask();
      await task.run(config);
    });
    return this;
  }
}
