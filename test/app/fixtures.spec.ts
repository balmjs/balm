import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import balm, { file as fsUtil } from 'balm-core';
import path from 'node:path';

describe('Real Fixtures Integration Suite (test/fixtures/src)', () => {
  const workspace = path.resolve(process.cwd(), 'test', 'fixtures');
  const distDir = path.join(workspace, 'dist');
  const tmpDir = path.join(workspace, '.tmp');

  beforeEach(async () => {
    balm.reset();
    await fsUtil.remove([distDir, tmpDir]);
  });

  afterEach(async () => {
    await fsUtil.remove([distDir, tmpDir]);
  });

  it('should compile full multi-page project with Sass, Webpack, and HTML processing', async () => {
    balm.config = {
      workspace,
      env: {
        isProd: true,
        isDev: false,
        isTest: true,
        inFrontend: true,
        inSSR: false,
        inDesktopApp: false,
        isMP: false
      },
      roots: {
        source: 'src',
        target: 'dist',
        tmp: '.tmp'
      },
      styles: {
        extname: 'scss'
      },
      scripts: {
        bundler: 'esbuild',
        entry: {
          index: path.join(workspace, 'src', 'scripts', 'index.js'),
          'page-a': path.join(workspace, 'src', 'scripts', 'page-a.js'),
          'page-b': path.join(workspace, 'src', 'scripts', 'page-b.js')
        }
      },
      assets: {
        cache: true
      },
      logs: {
        level: 3
      }
    };

    await balm.go((mix) => {
      mix.copy(path.join(workspace, 'src', 'images', '**/*'), path.join(distDir, 'img'));
      mix.copy(path.join(workspace, 'src', 'fonts', '**/*'), path.join(distDir, 'font'));
      mix.copy(path.join(workspace, 'src', 'media', '**/*'), path.join(distDir, 'media'));
      mix.publish();
    });

    // Check HTML files
    expect(await fsUtil.exists(path.join(distDir, 'index.html'))).toBe(true);
    expect(await fsUtil.exists(path.join(distDir, 'page-a.html'))).toBe(true);
    expect(await fsUtil.exists(path.join(distDir, 'page-b.html'))).toBe(true);

    // Check Cache Manifest
    expect(await fsUtil.exists(path.join(distDir, 'rev-manifest.json'))).toBe(true);
    const manifest = JSON.parse(await fsUtil.readFile(path.join(distDir, 'rev-manifest.json')));
    expect(manifest).toBeTypeOf('object');

    // Check Compiled CSS (hashed via cache)
    expect(manifest['css/main.css']).toBeDefined();
    expect(await fsUtil.exists(path.join(distDir, manifest['css/main.css']))).toBe(true);

    // Check Bundled JS files (hashed via cache)
    expect(manifest['js/index.js']).toBeDefined();
    expect(await fsUtil.exists(path.join(distDir, manifest['js/index.js']))).toBe(true);
    expect(manifest['js/page-a.js']).toBeDefined();
    expect(await fsUtil.exists(path.join(distDir, manifest['js/page-a.js']))).toBe(true);
    expect(manifest['js/page-b.js']).toBeDefined();
    expect(await fsUtil.exists(path.join(distDir, manifest['js/page-b.js']))).toBe(true);
  });

  it('should compile Less styles correctly from fixtures', async () => {
    balm.config = {
      workspace,
      useDefaults: false,
      logs: { level: 3 }
    };

    await balm.go((mix) => {
      mix.less(path.join(workspace, 'src', 'styles', 'main.less'), path.join(distDir, 'css'));
    });

    expect(await fsUtil.exists(path.join(distDir, 'css', 'main.css'))).toBe(true);
    const css = await fsUtil.readFile(path.join(distDir, 'css', 'main.css'));
    expect(css.length).toBeGreaterThan(0);
  });
});
