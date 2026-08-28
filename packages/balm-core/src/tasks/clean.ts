import path from 'node:path';
import { BaseTask } from '../runner/task.js';
import { BalmConfig } from '../types/index.js';
import { file } from '../utilities/file.js';
import { logger } from '../utilities/logger.js';

export class CleanTask extends BaseTask {
  constructor() {
    super({ name: 'clean', description: 'Clean output directories' });
  }

  async run(config: BalmConfig): Promise<void> {
    const targets = [
      path.join(config.workspace, config.roots.tmp),
      path.join(config.workspace, config.roots.target)
    ];

    const deleted = await file.remove(targets);
    logger.info('clean', `Deleted ${deleted.length} directories`);
  }
}
