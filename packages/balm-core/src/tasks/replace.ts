import path from 'node:path';
import { BaseTask } from '../runner/task.js';
import { BalmConfig, ReplaceOptions } from '../types/index.js';
import { Pipeline } from '../pipeline/pipeline.js';
import { transformReplace } from '../pipeline/transforms/replace.js';

export interface ReplaceTaskOptions {
  input: string | string[];
  output: string;
  options: ReplaceOptions | ReplaceOptions[];
}

export class ReplaceTask extends BaseTask {
  private taskOptions: ReplaceTaskOptions;

  constructor(taskOptions: ReplaceTaskOptions) {
    super({ name: 'replace', description: 'Replace content in files' });
    this.taskOptions = taskOptions;
  }

  async run(config: BalmConfig): Promise<void> {
    const pipeline = Pipeline.from(this.taskOptions.input, {
      cwd: config.workspace
    });

    pipeline.pipe(transformReplace(this.taskOptions.options));

    const outDir = path.isAbsolute(this.taskOptions.output)
      ? this.taskOptions.output
      : path.join(config.workspace, this.taskOptions.output);

    await pipeline.dest(outDir);
  }
}
