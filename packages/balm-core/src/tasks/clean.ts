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
    const workspaceRoot = path.resolve(config.workspace);
    const activeDestBase = path.resolve(
      config.dest?.base ||
        path.join(
          workspaceRoot,
          config.env.isProd || !config.inFrontend ? config.roots.target : config.roots.tmp
        )
    );

    // Safety guard: never delete workspace root or an ancestor directory
    if (
      activeDestBase === workspaceRoot ||
      workspaceRoot.startsWith(`${activeDestBase}${path.sep}`)
    ) {
      logger.warn('clean', `Skipping unsafe clean target: ${activeDestBase}`);
      return;
    }

    const deleted = await file.remove([activeDestBase]);
    logger.info('clean', `Deleted ${deleted.length} directories`);
  }
}
