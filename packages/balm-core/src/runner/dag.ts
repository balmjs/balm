import { BaseTask } from './task.js';
import { BalmConfig } from '../types/index.js';
import { logger } from '../utilities/logger.js';
import pc from 'picocolors';

export class TaskDAG {
  private tasks = new Map<string, BaseTask>();

  registerTask(task: BaseTask): void {
    this.tasks.set(task.name, task);
  }

  getTask(name: string): BaseTask | undefined {
    return this.tasks.get(name);
  }

  hasTask(name: string): boolean {
    return this.tasks.has(name);
  }

  clear(): void {
    this.tasks.clear();
  }

  /**
   * Run a list of tasks in strict series
   */
  async runSeries(taskNames: string[], config: BalmConfig): Promise<void> {
    for (const name of taskNames) {
      await this.executeTask(name, config);
    }
  }

  /**
   * Run a list of tasks in parallel
   */
  async runParallel(taskNames: string[], config: BalmConfig): Promise<void> {
    await Promise.all(taskNames.map((name) => this.executeTask(name, config)));
  }

  /**
   * Execute a single task resolving its dependencies first
   */
  async executeTask(
    taskName: string,
    config: BalmConfig,
    executed = new Set<string>()
  ): Promise<void> {
    if (executed.has(taskName)) return;

    const task = this.tasks.get(taskName);
    if (!task) {
      logger.warn('task', `Task ${pc.bold(taskName)} not found, skipping.`);
      return;
    }

    // Execute dependencies first
    if (task.deps && task.deps.length > 0) {
      for (const dep of task.deps) {
        await this.executeTask(dep, config, executed);
      }
    }

    const start = performance.now();
    try {
      await task.run(config);
      executed.add(taskName);
      const duration = (performance.now() - start).toFixed(1);
      if (!task.hidden) {
        logger.info('task', `${pc.cyan(task.name)} finished in ${pc.bold(duration + 'ms')}`);
      }
    } catch (error: any) {
      logger.error('task', `Task ${pc.bold(task.name)} failed: ${error?.message || error}`);
      throw error;
    }
  }
}
