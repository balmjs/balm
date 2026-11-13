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
  private watchers: fs.FSWatcher[] = [];
  private isRebuilding = false;

  constructor(config: BalmConfig, broadcast: WatcherBroadcast) {
    this.config = config;
    this.broadcast = broadcast;
    this.styleTask = new StyleTask();
    this.scriptTask = new ScriptTask();
    this.htmlTask = new HtmlTask();
  }

  private getWatchDirs(): string[] {
    const candidates = [
      this.config.src.base,
      ...(this.config.scripts.includeJsResource || []),
      ...(this.config.styles.atImportPaths || [])
    ];

    const resolved = candidates
      .filter(Boolean)
      .map((dir) => (path.isAbsolute(dir) ? dir : path.resolve(this.config.workspace, dir)))
      .filter((dir) => fs.existsSync(dir) && !dir.includes(`${path.sep}node_modules`));

    const unique = Array.from(new Set(resolved)).sort((a, b) => a.length - b.length);
    return unique.filter(
      (dir, index) =>
        !unique.slice(0, index).some((parent) => dir.startsWith(`${parent}${path.sep}`))
    );
  }

  start(): void {
    const watchDirs = this.getWatchDirs();
    if (!watchDirs.length) return;

    for (const watchDir of watchDirs) {
      logger.info('watch', `Watching for file changes in ${pc.cyan(watchDir)}`);

      try {
        const watcher = fs.watch(watchDir, { recursive: true }, (_eventType, filename) => {
          if (!filename) return;
          const normalized = filename.replace(/\\/g, '/');
          if (normalized.includes('node_modules/') || normalized.startsWith('.git/')) {
            return;
          }
          this.pendingFiles.add(filename);

          if (this.debounceTimer) clearTimeout(this.debounceTimer);
          this.debounceTimer = setTimeout(() => {
            this.handleChanges();
          }, 50);
        });
        this.watchers.push(watcher);
      } catch (err: any) {
        logger.warn('watch', `Native recursive watch failed for ${watchDir}: ${err.message}`);
      }
    }
  }

  private async handleChanges(): Promise<void> {
    if (this.isRebuilding) {
      this.debounceTimer = setTimeout(() => this.handleChanges(), 50);
      return;
    }

    const changed = Array.from(this.pendingFiles);
    this.pendingFiles.clear();
    if (!changed.length) return;

    const hasStyle = changed.some((f) => /\.(scss|sass|less|css)$/i.test(f));
    const hasScript = changed.some((f) =>
      /\.(js|mjs|cjs|ts|jsx|tsx|vue|md|json)$/i.test(f)
    );
    const hasHtml = changed.some((f) => /\.html$/i.test(f));

    this.isRebuilding = true;
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
    } finally {
      this.isRebuilding = false;
    }
  }

  stop(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    for (const watcher of this.watchers) {
      watcher.close();
    }
    this.watchers = [];
  }
}
