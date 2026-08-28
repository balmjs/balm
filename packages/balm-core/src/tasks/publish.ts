import path from 'node:path';
import { BaseTask } from '../runner/task.js';
import { BalmConfig, TemplateOption, RenameOptions } from '../types/index.js';
import { Pipeline } from '../pipeline/pipeline.js';
import { transformRename } from '../pipeline/transforms/rename.js';
import { logger } from '../utilities/logger.js';

export interface PublishTaskOptions {
  input?: string | TemplateOption[];
  output?: string;
  renameOptions?: string | Function | RenameOptions;
}

export class PublishTask extends BaseTask {
  private options: PublishTaskOptions;

  constructor(options: PublishTaskOptions = {}) {
    super({ name: 'publish', description: 'Publish assets or templates' });
    this.options = options;
  }

  async run(config: BalmConfig): Promise<void> {
    if (!config.env.isProd) {
      logger.warn('publish', '`mix.publish()` is only supported in production mode');
      return;
    }

    const { input, output, renameOptions } = this.options;

    if (Array.isArray(input)) {
      for (const item of input) {
        await this.publishItem(config, item.input, item.output, item.renameOptions);
      }
    } else if (typeof input === 'string' && output) {
      await this.publishItem(config, input, output, renameOptions);
    } else {
      // Default: publish all static assets from dest.base to assets.static
      const srcDir = config.dest.base;
      const targetDir = config.assets.static || path.join(config.assets.root, config.assets.mainDir);

      const pipeline = Pipeline.from(['**/*'], {
        cwd: srcDir,
        base: srcDir
      });

      await pipeline.dest(path.resolve(config.workspace, targetDir));
    }
  }

  private async publishItem(
    config: BalmConfig,
    input: string,
    output: string,
    rename?: string | Function | RenameOptions
  ): Promise<void> {
    const srcPath = path.isAbsolute(input) ? input : path.join(config.dest.base, input);
    const destDir = path.isAbsolute(output)
      ? output
      : path.join(config.workspace, config.assets.root, output);

    const pipeline = Pipeline.from(srcPath, {
      cwd: config.dest.base
    });

    if (rename) {
      pipeline.pipe(transformRename(rename));
    }

    await pipeline.dest(destDir);
  }
}
