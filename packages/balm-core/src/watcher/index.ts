import fs from 'node:fs';
import path from 'node:path';
import { BalmConfig } from '../types/index.js';
import { StyleTask } from '../tasks/style.js';
import { ScriptTask } from '../tasks/script.js';
import { HtmlTask } from '../tasks/html.js';
import { StaticTask } from '../tasks/static.js';
import { logger } from '../utilities/logger.js';
import pc from 'picocolors';

export interface WatcherBroadcast {
  (data: { type: 'reload' | 'reload-css'; file?: string }): void;
}

const IGNORED_BASENAMES = new Set(['.DS_Store', 'Thumbs.db', '4913']);
const CONFIG_FILENAMES = [
  'balm.config.js',
  'balm.config.mjs',
  'balm.config.cjs',
  'balm.config.ts'
];

function isSubPath(targetPath: string, parentDir: string): boolean {
  const normalizedTarget = path.resolve(targetPath);
  const normalizedParent = path.resolve(parentDir);
  return (
    normalizedTarget === normalizedParent ||
    normalizedTarget.startsWith(`${normalizedParent}${path.sep}`)
  );
}

export function isIgnoredWatchFile(
  filePath: string,
  excludedDirs: string[] = []
): boolean {
  if (!filePath) return true;

  const normalized = filePath.replace(/\\/g, '/');
  if (
    normalized.includes('/node_modules/') ||
    normalized.startsWith('node_modules/') ||
    normalized.includes('/.git/') ||
    normalized.startsWith('.git/')
  ) {
    return true;
  }

  const base = path.basename(normalized);
  if (
    IGNORED_BASENAMES.has(base) ||
    base.startsWith('.#') ||
    base.startsWith('#') ||
    base.startsWith('.~') ||
    /(\.(swp|swo|swx|tmp|bak)|~)$/i.test(base)
  ) {
    return true;
  }

  if (path.isAbsolute(filePath)) {
    for (const dir of excludedDirs) {
      if (dir && isSubPath(filePath, dir)) {
        return true;
      }
    }
  }

  return false;
}

export class FileWatcher {
  private config: BalmConfig;
  private broadcast: WatcherBroadcast;
  private debounceTimer: NodeJS.Timeout | null = null;
  private configWarnTimer: NodeJS.Timeout | null = null;
  private pendingFiles = new Set<string>();
  private styleTask: StyleTask;
  private scriptTask: ScriptTask;
  private htmlTask: HtmlTask;
  private staticTask: StaticTask;
  private watchers: fs.FSWatcher[] = [];
  private isRebuilding = false;
  private needsRebuild = false;
  private recoveryPromise: Promise<void> | null = null;

  constructor(config: BalmConfig, broadcast: WatcherBroadcast) {
    this.config = config;
    this.broadcast = broadcast;
    this.styleTask = new StyleTask();
    this.scriptTask = new ScriptTask({ incremental: true });
    this.htmlTask = new HtmlTask();
    this.staticTask = new StaticTask();
  }

  private getExcludedOutputDirs(): string[] {
    const workspaceRoot = path.resolve(this.config.workspace);
    const candidates = [
      this.config.dest?.base,
      this.config.roots?.tmp ? path.join(workspaceRoot, this.config.roots.tmp) : '',
      this.config.roots?.target ? path.join(workspaceRoot, this.config.roots.target) : ''
    ].filter((dir): dir is string => Boolean(dir));

    return Array.from(
      new Set(
        candidates
          .map((dir) => path.resolve(dir))
          .filter((dir) => dir !== workspaceRoot)
      )
    );
  }

  private resolveAliasWatchDirs(excludedDirs: string[]): string[] {
    const workspaceRoot = path.resolve(this.config.workspace);
    const mergedAliases = {
      ...this.config.alias,
      ...this.config.scripts?.alias,
      ...this.config.styles?.alias
    };

    const dirs: string[] = [];
    for (const target of Object.values(mergedAliases)) {
      if (typeof target !== 'string' || !target.trim()) continue;

      const resolved = path.isAbsolute(target)
        ? path.resolve(target)
        : path.resolve(workspaceRoot, target);

      if (resolved.includes(`${path.sep}node_modules`)) continue;
      if (!fs.existsSync(resolved)) continue;

      try {
        const stat = fs.statSync(resolved);
        const watchDir = stat.isDirectory() ? resolved : path.dirname(resolved);
        if (
          watchDir === workspaceRoot ||
          watchDir.includes(`${path.sep}node_modules`) ||
          excludedDirs.some((excluded) => isSubPath(watchDir, excluded))
        ) {
          continue;
        }
        dirs.push(watchDir);
      } catch {
        // ignore unreadable alias targets
      }
    }

    return dirs;
  }

  private getWatchDirs(): string[] {
    const workspaceRoot = path.resolve(this.config.workspace);
    const excludedDirs = this.getExcludedOutputDirs();
    const publicDir = path.join(workspaceRoot, 'public');
    const customTemplate = this.config.scripts?.htmlPluginOptions?.template;
    const customTemplateDir =
      typeof customTemplate === 'string' && customTemplate.trim()
        ? path.dirname(path.resolve(workspaceRoot, customTemplate))
        : '';

    const candidates = [
      this.config.src.base,
      publicDir,
      customTemplateDir,
      ...(this.config.scripts.includeJsResource || []),
      ...(this.config.styles.atImportPaths || []),
      ...this.resolveAliasWatchDirs(excludedDirs)
    ];

    const resolved = candidates
      .filter(Boolean)
      .map((dir) =>
        path.isAbsolute(dir) ? path.resolve(dir) : path.resolve(workspaceRoot, dir)
      )
      .filter((dir) => {
        if (dir.includes(`${path.sep}node_modules`)) return false;
        if (excludedDirs.some((excluded) => isSubPath(dir, excluded))) return false;
        try {
          return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
        } catch {
          return false;
        }
      });

    const unique = Array.from(new Set(resolved)).sort((a, b) => a.length - b.length);
    return unique.filter(
      (dir, index) =>
        !unique.slice(0, index).some((parent) => dir.startsWith(`${parent}${path.sep}`))
    );
  }

  private watchConfigFile(): void {
    const workspaceRoot = path.resolve(this.config.workspace);
    for (const name of CONFIG_FILENAMES) {
      const configPath = path.join(workspaceRoot, name);
      if (!fs.existsSync(configPath)) continue;

      try {
        const watcher = fs.watch(configPath, () => {
          if (this.configWarnTimer) clearTimeout(this.configWarnTimer);
          this.configWarnTimer = setTimeout(() => {
            logger.warn(
              'watch',
              `${pc.yellow(name)} changed — restart dev server to apply config updates`
            );
          }, 200);
        });
        watcher.on('error', (err: Error) => {
          logger.warn('watch', `Config watcher error for ${name}: ${err.message}`);
        });
        this.watchers.push(watcher);
      } catch {
        // ignore optional config watcher errors
      }
      break;
    }
  }

  start(): void {
    const watchDirs = this.getWatchDirs();
    const excludedDirs = this.getExcludedOutputDirs();

    for (const watchDir of watchDirs) {
      logger.info('watch', `Watching for file changes in ${pc.cyan(watchDir)}`);

      try {
        const watcher = fs.watch(watchDir, { recursive: true }, (_eventType, filename) => {
          if (!filename) return;
          const fullPath = path.join(watchDir, filename.toString());
          if (isIgnoredWatchFile(fullPath, excludedDirs)) {
            return;
          }

          this.pendingFiles.add(fullPath);

          if (this.debounceTimer) clearTimeout(this.debounceTimer);
          this.debounceTimer = setTimeout(() => {
            void this.handleChanges();
          }, 50);
        });
        watcher.on('error', (err: Error) => {
          logger.warn('watch', `Watcher error for ${watchDir}: ${err.message}`);
        });
        this.watchers.push(watcher);
      } catch (err: any) {
        logger.warn('watch', `Native recursive watch failed for ${watchDir}: ${err.message}`);
      }
    }

    this.watchConfigFile();
  }

  async rebuildAll(): Promise<void> {
    if (this.recoveryPromise) {
      return this.recoveryPromise;
    }

    this.recoveryPromise = (async () => {
      this.isRebuilding = true;
      try {
        const start = performance.now();
        await this.styleTask.run(this.config);
        await this.scriptTask.run(this.config);
        await this.staticTask.run(this.config);
        await this.htmlTask.run(this.config);
        const duration = (performance.now() - start).toFixed(1);
        logger.info('watch', `Recovered dev workspace in ${pc.bold(duration + 'ms')}`);
      } finally {
        this.isRebuilding = false;
      }
    })();

    try {
      await this.recoveryPromise;
    } finally {
      this.recoveryPromise = null;
    }
  }

  private classifyChanges(changed: string[]) {
    const publicDir = path.resolve(this.config.workspace, 'public');
    const staticAssetDirs = [
      this.config.src.img,
      this.config.src.font,
      this.config.src.media
    ]
      .filter(Boolean)
      .map((dir) => path.resolve(dir));
    const manifestBasename = path.basename(this.config.pwa?.manifest || 'manifest.json');

    let hasStyle = false;
    let hasScript = false;
    let hasHtml = false;
    let hasStatic = false;
    let hasOther = false;

    for (const filePath of changed) {
      const isAbs = path.isAbsolute(filePath);
      const base = path.basename(filePath);

      if (isAbs && isSubPath(filePath, publicDir)) {
        hasStatic = true;
        continue;
      }

      if (isAbs && staticAssetDirs.some((dir) => isSubPath(filePath, dir))) {
        hasStatic = true;
        continue;
      }

      if (base === manifestBasename || /\.webmanifest$/i.test(base)) {
        hasStatic = true;
        hasHtml = true;
        continue;
      }

      if (/\.html?$/i.test(base)) {
        hasHtml = true;
        continue;
      }

      if (/\.(scss|sass|less|css)$/i.test(base)) {
        hasStyle = true;
        continue;
      }

      if (/\.(js|mjs|cjs|ts|jsx|tsx|vue|md|json)$/i.test(base)) {
        hasScript = true;
        continue;
      }

      if (
        /\.(ico|png|jpe?g|gif|webp|avif|svg|txt|xml|woff2?|ttf|eot|otf|mp4|webm|mp3|ogg|wav)$/i.test(
          base
        )
      ) {
        hasStatic = true;
        continue;
      }

      hasOther = true;
    }

    return { hasStyle, hasScript, hasHtml, hasStatic, hasOther };
  }

  private async handleChanges(): Promise<void> {
    if (this.isRebuilding) {
      this.needsRebuild = true;
      return;
    }

    const excludedDirs = this.getExcludedOutputDirs();
    const changed = Array.from(this.pendingFiles).filter(
      (f) => !isIgnoredWatchFile(f, excludedDirs)
    );
    this.pendingFiles.clear();
    if (!changed.length) return;

    const { hasStyle, hasScript, hasHtml, hasStatic, hasOther } =
      this.classifyChanges(changed);

    this.isRebuilding = true;
    try {
      if (hasStyle) {
        const start = performance.now();
        await this.styleTask.run(this.config);
        const duration = (performance.now() - start).toFixed(1);
        logger.info('watch', `Recompiled styles in ${pc.bold(duration + 'ms')}`);
      }

      if (hasScript) {
        const start = performance.now();
        await this.scriptTask.run(this.config);
        const duration = (performance.now() - start).toFixed(1);
        logger.info('watch', `Rebundled scripts in ${pc.bold(duration + 'ms')}`);
      }

      if (hasStatic) {
        const start = performance.now();
        await this.staticTask.run(this.config);
        const duration = (performance.now() - start).toFixed(1);
        logger.info('watch', `Synced static assets in ${pc.bold(duration + 'ms')}`);
      }

      if (hasHtml) {
        const start = performance.now();
        await this.htmlTask.run(this.config);
        const duration = (performance.now() - start).toFixed(1);
        logger.info('watch', `Recompiled HTML in ${pc.bold(duration + 'ms')}`);
      }

      // Coalesce broadcasts: send a single full reload if anything beyond styles changed
      if (hasScript || hasHtml || hasStatic || hasOther) {
        this.broadcast({ type: 'reload' });
      } else if (hasStyle) {
        this.broadcast({ type: 'reload-css' });
      }
    } catch (err: any) {
      logger.error('watch', `Incremental rebuild failed: ${err?.message || err}`);
    } finally {
      this.isRebuilding = false;
      if (this.needsRebuild || this.pendingFiles.size > 0) {
        this.needsRebuild = false;
        this.debounceTimer = setTimeout(() => {
          void this.handleChanges();
        }, 50);
      }
    }
  }

  stop(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    if (this.configWarnTimer) {
      clearTimeout(this.configWarnTimer);
      this.configWarnTimer = null;
    }
    for (const watcher of this.watchers) {
      watcher.close();
    }
    this.watchers = [];
    void this.scriptTask.dispose();
  }
}
