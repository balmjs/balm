import path from 'node:path';
import { BaseTask } from '../runner/task.js';
import { BalmConfig } from '../types/index.js';
import { file } from '../utilities/file.js';
import { logger } from '../utilities/logger.js';

export class RemoveTask extends BaseTask {
  private target: string | string[];

  constructor(target: string | string[]) {
    super({ name: 'remove', description: 'Remove files and directories' });
    this.target = target;
  }

  async run(config: BalmConfig): Promise<void> {
    const targets = Array.isArray(this.target) ? this.target : [this.target];
    const resolvedTargets = targets.map((t) =>
      path.isAbsolute(t) ? t : path.join(config.workspace, t)
    );

    const deleted = await file.remove(resolvedTargets);
    logger.warn('remove', `Removed: ${deleted.join(', ')}`);
  }
}
