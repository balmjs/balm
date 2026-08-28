import path from 'node:path';
import { BaseTask } from '../runner/task.js';
import { BalmConfig, RenameOptions } from '../types/index.js';
import { Pipeline } from '../pipeline/pipeline.js';
import { transformRename } from '../pipeline/transforms/rename.js';

export interface CopyTaskOptions {
  input: string | string[];
  output: string;
  rename?: RenameOptions | string | Function;
}

export class CopyTask extends BaseTask {
  private options: CopyTaskOptions;

  constructor(options: CopyTaskOptions) {
    super({ name: 'copy', description: 'Copy files to destination' });
    this.options = options;
  }

  async run(config: BalmConfig): Promise<void> {
    const pipeline = Pipeline.from(this.options.input, {
      cwd: config.workspace
    });

    if (this.options.rename) {
      pipeline.pipe(transformRename(this.options.rename));
    }

    const outDir = path.isAbsolute(this.options.output)
      ? this.options.output
      : path.join(config.workspace, this.options.output);

    await pipeline.dest(outDir);
  }
}
