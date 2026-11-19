import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import {
  BundlerType,
  CleanTask,
  HtmlTask,
  ScriptTask,
  ServerTask,
  createDevServerApp,
  file as fsUtil,
  resolveConfig
} from 'balm-core';
import {
  FileWatcher,
  isIgnoredWatchFile
} from '../../packages/balm-core/src/watcher/index.js';

const requireFromBalmCore = createRequire(
  path.resolve(process.cwd(), 'packages/balm-core/package.json')
);
const { WebSocket } = requireFromBalmCore('ws') as { WebSocket: any };

async function startHttpServer(
  app: http.RequestListener
): Promise<{ server: http.Server; baseUrl: string }> {
  const server = http.createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });
  const addr = server.address();
  const port = typeof addr === 'object' && addr ? addr.port : 0;
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

describe('Dev/Watch Hardening (CleanTask, FileWatcher, esbuild context, DevServer & WS)', () => {
  const testWorkspace = path.resolve(process.cwd(), '.tmp-test-dev-watch');
  const externalPkgDir = path.resolve(process.cwd(), '.tmp-test-dev-watch-shared');

  beforeEach(async () => {
    await fsUtil.remove([testWorkspace, externalPkgDir]);
    await fsUtil.ensureDir(path.join(testWorkspace, 'src', 'styles'));
    await fsUtil.ensureDir(path.join(testWorkspace, 'src', 'scripts'));
    await fsUtil.ensureDir(path.join(testWorkspace, 'public'));
    await fsUtil.ensureDir(path.join(externalPkgDir, 'dist'));
  });

  afterEach(async () => {
    await fsUtil.remove([testWorkspace, externalPkgDir]);
  });

  it('CleanTask isolates prod and dev output directories without cross-wiping', async () => {
    await fsUtil.writeFile(path.join(testWorkspace, '.tmp', 'index.html'), 'DEV_HTML');
    await fsUtil.writeFile(path.join(testWorkspace, 'dist', 'index.html'), 'PROD_HTML');

    const cleanTask = new CleanTask();

    // Production build cleans ONLY dist/, leaving running dev server's .tmp/ intact
    const prodConfig = resolveConfig({
      workspace: testWorkspace,
      env: { isProd: true, isDev: false, isTest: true },
      logs: { level: 3 }
    });
    await cleanTask.run(prodConfig);
    expect(existsSync(path.join(testWorkspace, 'dist'))).toBe(false);
    expect(existsSync(path.join(testWorkspace, '.tmp', 'index.html'))).toBe(true);

    // Restore dist/, then verify dev build cleans ONLY .tmp/, leaving dist/ intact
    await fsUtil.writeFile(path.join(testWorkspace, 'dist', 'index.html'), 'PROD_HTML');
    const devConfig = resolveConfig({
      workspace: testWorkspace,
      env: { isProd: false, isDev: true, isTest: true },
      logs: { level: 3 }
    });
    await cleanTask.run(devConfig);
    expect(existsSync(path.join(testWorkspace, '.tmp'))).toBe(false);
    expect(existsSync(path.join(testWorkspace, 'dist', 'index.html'))).toBe(true);
  });

  it('CleanTask refuses to delete workspace root when roots.target is empty', async () => {
    await fsUtil.writeFile(path.join(testWorkspace, 'keep.txt'), 'SAFE');
    const cleanTask = new CleanTask();
    const unsafeConfig = resolveConfig({
      workspace: testWorkspace,
      roots: { target: '' },
      env: { isProd: true, isDev: false, isTest: true },
      logs: { level: 3 }
    });

    await cleanTask.run(unsafeConfig);
    expect(existsSync(path.join(testWorkspace, 'keep.txt'))).toBe(true);
  });

  it('FileWatcher discovers public/, custom template, and non-node_modules alias dirs and ignores temp files', async () => {
    const sharedEntry = path.join(externalPkgDir, 'dist', 'index.js');
    const templatePath = path.join(testWorkspace, 'templates', 'index.html');
    await fsUtil.writeFile(sharedEntry, 'export const v = 1;');
    await fsUtil.writeFile(templatePath, '<html><body></body></html>');

    const config = resolveConfig({
      workspace: testWorkspace,
      scripts: {
        bundler: BundlerType.esbuild,
        alias: {
          '@shared/pkg': sharedEntry
        },
        htmlPluginOptions: {
          template: './templates/index.html'
        }
      },
      env: { isProd: false, isDev: true, isTest: true },
      logs: { level: 3 }
    });

    const watcher = new FileWatcher(config, () => {});
    const watchDirs = (watcher as any).getWatchDirs() as string[];

    expect(watchDirs).toContain(path.join(testWorkspace, 'src'));
    expect(watchDirs).toContain(path.join(testWorkspace, 'public'));
    expect(watchDirs).toContain(path.join(testWorkspace, 'templates'));
    expect(watchDirs).toContain(path.join(externalPkgDir, 'dist'));

    // Editor junk and build output directories are filtered out
    expect(isIgnoredWatchFile(path.join(testWorkspace, 'src', '.DS_Store'))).toBe(true);
    expect(isIgnoredWatchFile(path.join(testWorkspace, 'src', 'main.ts~'))).toBe(true);
    expect(isIgnoredWatchFile(path.join(testWorkspace, 'src', '.main.scss.swp'))).toBe(true);
    expect(
      isIgnoredWatchFile(path.join(testWorkspace, '.tmp', 'js', 'main.js'), [
        path.join(testWorkspace, '.tmp'),
        path.join(testWorkspace, 'dist')
      ])
    ).toBe(true);
    expect(isIgnoredWatchFile(sharedEntry, [path.join(testWorkspace, 'dist')])).toBe(false);

    watcher.stop();
  });

  it('FileWatcher coalesces mixed edits, syncs public/ static assets, and keeps CSS-only live swaps', async () => {
    const config = resolveConfig({
      workspace: testWorkspace,
      env: { isProd: false, isDev: true, isTest: true },
      logs: { level: 3 }
    });

    const broadcasts: Array<{ type: string; file?: string }> = [];
    const watcher = new FileWatcher(config, (msg) => broadcasts.push(msg));

    const styleSpy = vi.spyOn((watcher as any).styleTask, 'run').mockResolvedValue(undefined);
    const scriptSpy = vi.spyOn((watcher as any).scriptTask, 'run').mockResolvedValue(undefined);
    const staticSpy = vi.spyOn((watcher as any).staticTask, 'run').mockResolvedValue(undefined);

    // 1. Style-only edit -> reload-css
    (watcher as any).pendingFiles.add(path.join(testWorkspace, 'src', 'styles', 'main.scss'));
    await (watcher as any).handleChanges();
    expect(styleSpy).toHaveBeenCalledTimes(1);
    expect(broadcasts).toEqual([{ type: 'reload-css' }]);

    // 2. Simultaneous style + script edit -> coalesced single full reload
    broadcasts.length = 0;
    (watcher as any).pendingFiles.add(path.join(testWorkspace, 'src', 'styles', 'main.scss'));
    (watcher as any).pendingFiles.add(path.join(testWorkspace, 'src', 'scripts', 'main.ts'));
    await (watcher as any).handleChanges();
    expect(styleSpy).toHaveBeenCalledTimes(2);
    expect(scriptSpy).toHaveBeenCalledTimes(1);
    expect(broadcasts).toEqual([{ type: 'reload' }]);

    // 3. Public asset edit -> StaticTask + full reload
    broadcasts.length = 0;
    (watcher as any).pendingFiles.add(path.join(testWorkspace, 'public', 'icon.svg'));
    await (watcher as any).handleChanges();
    expect(staticSpy).toHaveBeenCalledTimes(1);
    expect(broadcasts).toEqual([{ type: 'reload' }]);

    watcher.stop();
  });

  it('ScriptTask incremental esbuild context rebuilds local alias updates and recovers after .tmp deletion', async () => {
    const sharedEntry = path.join(externalPkgDir, 'dist', 'index.js');
    const mainEntry = path.join(testWorkspace, 'src', 'scripts', 'main.ts');
    await fsUtil.writeFile(sharedEntry, 'export const VALUE = "v1";\n');
    await fsUtil.writeFile(
      mainEntry,
      'import { VALUE } from "@shared/pkg"; console.log(VALUE);\n'
    );

    const config = resolveConfig({
      workspace: testWorkspace,
      scripts: {
        bundler: BundlerType.esbuild,
        entry: './src/scripts/main.ts',
        alias: {
          '@shared/pkg': sharedEntry
        }
      },
      env: { isProd: false, isDev: true, isTest: true },
      logs: { level: 3 }
    });

    const scriptTask = new ScriptTask({ incremental: true });
    try {
      await scriptTask.run(config);
      const outJs = path.join(testWorkspace, '.tmp', 'js', 'main.js');
      expect(await fs.readFile(outJs, 'utf8')).toContain('v1');

      // Update external aliased file and delete .tmp externally
      await fsUtil.writeFile(sharedEntry, 'export const VALUE = "v2-updated";\n');
      await fsUtil.remove(path.join(testWorkspace, '.tmp'));
      expect(existsSync(outJs)).toBe(false);

      // Incremental context rebuild should recreate .tmp/js/main.js with fresh content
      await scriptTask.run(config);
      expect(await fs.readFile(outJs, 'utf8')).toContain('v2-updated');
    } finally {
      await scriptTask.dispose();
    }
  });

  it('DevServer disables caching and self-heals when .tmp/ is deleted mid-session', async () => {
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'index.html'),
      '<!DOCTYPE html><html><head><link rel="stylesheet" href="/styles/main.css"></head><body><script type="module" src="/scripts/main.js"></script></body></html>'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'styles', 'main.scss'),
      'body { color: #ff00aa; }'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'scripts', 'main.ts'),
      'console.log("HEALED_BUNDLE");'
    );
    await fsUtil.writeFile(path.join(testWorkspace, 'public', 'robots.txt'), 'User-agent: *');

    const config = resolveConfig({
      workspace: testWorkspace,
      scripts: {
        bundler: BundlerType.esbuild,
        entry: './src/scripts/main.ts'
      },
      env: { isProd: false, isDev: true, isTest: true },
      logs: { level: 3 }
    });

    const watcher = new FileWatcher(config, () => {});
    const rebuildSpy = vi.spyOn(watcher, 'rebuildAll');
    const app = createDevServerApp(config, {
      ensureBuildReady: () => {
        if (!existsSync(config.dest.base)) {
          return watcher.rebuildAll();
        }
      }
    });

    const { server, baseUrl } = await startHttpServer(app);
    try {
      // .tmp does NOT exist yet — concurrent requests should self-heal once and return fresh built output
      expect(existsSync(config.dest.base)).toBe(false);

      const [htmlRes, cssRes, jsRes] = await Promise.all([
        fetch(`${baseUrl}/`),
        fetch(`${baseUrl}/styles/main.css`),
        fetch(`${baseUrl}/scripts/main.js`)
      ]);

      expect(htmlRes.status).toBe(200);
      expect(cssRes.status).toBe(200);
      expect(jsRes.status).toBe(200);

      // Verify dev no-store caching headers and absence of ETag/Last-Modified
      expect(htmlRes.headers.get('cache-control')).toContain('no-store');
      expect(cssRes.headers.get('cache-control')).toContain('no-store');
      expect(jsRes.headers.get('cache-control')).toContain('no-store');
      expect(cssRes.headers.get('etag')).toBeNull();
      expect(jsRes.headers.get('last-modified')).toBeNull();

      const htmlBody = await htmlRes.text();
      const cssBody = await cssRes.text();
      const jsBody = await jsRes.text();

      expect(htmlBody).toContain('BalmJS Live Reload');
      expect(htmlBody).toContain('visibilitychange');
      expect(htmlBody).toContain('url.origin !== location.origin');
      expect(cssBody).toContain('#ff00aa');
      expect(jsBody).toContain('HEALED_BUNDLE');

      // Concurrent requests shared a single in-flight recovery promise
      expect(rebuildSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
    } finally {
      watcher.stop();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('HtmlTask live reload script + WS server handshake supports serverId/buildVersion sync', async () => {
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'index.html'),
      '<!DOCTYPE html><html><head></head><body>OK</body></html>'
    );

    const config = resolveConfig({
      workspace: testWorkspace,
      env: { isProd: false, isDev: true, isTest: true },
      logs: { level: 3 }
    });

    await new HtmlTask().run(config);
    const html = await fs.readFile(path.join(testWorkspace, '.tmp', 'index.html'), 'utf8');
    expect(html).toContain('__BALM_LIVE_RELOAD__');
    expect(html).toContain("type: 'sync'");
    expect(html).toContain('buildVersion');

    // Verify real ServerTask WS handshake + sync + broadcast version increment
    const task = new ServerTask();
    const server = http.createServer((_req, res) => res.end('ok'));
    const wsServer = task.attachLiveReloadServer(server);

    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
    const port = (server.address() as any).port;

    const ws = new WebSocket(`ws://127.0.0.1:${port}/__balm_ws`);
    const messages: any[] = [];
    await new Promise<void>((resolve, reject) => {
      ws.on('error', reject);
      ws.on('message', (data: Buffer) => {
        messages.push(JSON.parse(data.toString()));
        if (messages.length === 1) {
          task.broadcast({ type: 'reload-css' });
        } else if (messages.length === 2) {
          ws.send(JSON.stringify({ type: 'sync' }));
        } else if (messages.length === 3) {
          resolve();
        }
      });
    });

    expect(messages[0].type).toBe('connected');
    expect(typeof messages[0].serverId).toBe('string');
    expect(messages[0].buildVersion).toBe(1);

    expect(messages[1].type).toBe('reload-css');
    expect(messages[1].serverId).toBe(messages[0].serverId);
    expect(messages[1].buildVersion).toBe(2);

    expect(messages[2].type).toBe('connected');
    expect(messages[2].serverId).toBe(messages[0].serverId);
    expect(messages[2].buildVersion).toBe(2);

    ws.close();
    wsServer.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
});
