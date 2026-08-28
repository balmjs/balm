import { BalmConfig } from '../types/index.js';
import { logger } from '../utilities/logger.js';

export interface TaskOptions {
  name: string;
  deps?: string[];
  description?: string;
  hidden?: boolean;
}

export abstract class BaseTask {
  name: string;
  deps: string[];
  description?: string;
  hidden: boolean;

  constructor(options: TaskOptions) {
    this.name = options.name;
    this.deps = options.deps || [];
    this.description = options.description;
    this.hidden = options.hidden || false;
  }

  abstract run(config: BalmConfig): Promise<void> | void;
}

export class FunctionTask extends BaseTask {
  private fn: (config: BalmConfig) => Promise<void> | void;

  constructor(name: string, fn: (config: BalmConfig) => Promise<void> | void, deps: string[] = []) {
    super({ name, deps });
    this.fn = fn;
  }

  async run(config: BalmConfig): Promise<void> {
    await this.fn(config);
  }
}
