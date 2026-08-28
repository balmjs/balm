import fs from 'node:fs';
import path from 'node:path';
import { BalmConfig } from '../types/index.js';
import { StyleTask } from '../tasks/style.js';
import { ScriptTask } from '../tasks/script.js';
import { HtmlTask } from '../tasks/html.js';
import { logger } from '../utilities/logger.js';
import pc from 'picocolors';

export interface WatcherBroadcast {
  (data: { type: 'reload' | 'reload-css'; file?: string }): void;
}

export class FileWatcher {
  private config: BalmConfig;
  private broadcast: WatcherBroadcast;
  private debounceTimer: NodeJS.Timeout | null = null;
  private pendingFiles = new Set<string>();
  private styleTask: StyleTask;
  private scriptTask: ScriptTask;
  private htmlTask: HtmlTask;
  private watcher: fs.FSWatcher | null = null;

  constructor(config: BalmConfig, broadcast: WatcherBroadcast) {
    this.config = config;
    this.broadcast = broadcast;
    this.styleTask = new StyleTask();
    this.scriptTask = new ScriptTask();
    this.htmlTask = new HtmlTask();
  }

  start(): void {
    const watchDir = this.config.src.base;
    if (!fs.existsSync(watchDir)) return;

    logger.info('watch', `Watching for file changes in ${pc.cyan(watchDir)}`);

    try {
      this.watcher = fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
        if (!filename) return;
        this.pendingFiles.add(filename);

        if (this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.handleChanges();
        }, 50);
      });
    } catch (err: any) {
      logger.warn('watch', `Native recursive watch failed: ${err.message}`);
    }
  }

  private async handleChanges(): Promise<void> {
    const changed = Array.from(this.pendingFiles);
    this.pendingFiles.clear();

    const hasStyle = changed.some((f) => /\.(scss|sass|less|css)$/i.test(f));
    const hasScript = changed.some((f) => /\.(js|mjs|cjs|ts|jsx|tsx)$/i.test(f));
    const hasHtml = changed.some((f) => /\.html$/i.test(f));

    try {
      if (hasStyle) {
        const start = performance.now();
        await this.styleTask.run(this.config);
        const duration = (performance.now() - start).toFixed(1);
        logger.info('watch', `Recompiled styles in ${pc.bold(duration + 'ms')}`);
        this.broadcast({ type: 'reload-css' });
      }

      if (hasScript) {
        const start = performance.now();
        await this.scriptTask.run(this.config);
        const duration = (performance.now() - start).toFixed(1);
        logger.info('watch', `Rebundled scripts in ${pc.bold(duration + 'ms')}`);
        this.broadcast({ type: 'reload' });
      }

      if (hasHtml) {
        const start = performance.now();
        await this.htmlTask.run(this.config);
        const duration = (performance.now() - start).toFixed(1);
        logger.info('watch', `Recompiled HTML in ${pc.bold(duration + 'ms')}`);
        this.broadcast({ type: 'reload' });
      }

      if (!hasStyle && !hasScript && !hasHtml && changed.length > 0) {
        this.broadcast({ type: 'reload' });
      }
    } catch (err: any) {
      logger.error('watch', `Incremental rebuild failed: ${err?.message || err}`);
    }
  }

  stop(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
}
