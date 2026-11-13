import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { resolveConfig, runWebpack, deepMerge, file as fsUtil } from 'balm-core';
import { FileWatcher } from '../../packages/balm-core/src/watcher/index.js';
import path from 'node:path';
import fs from 'node:fs/promises';

describe('Webpack Bundler Default Loaders & Compatibility', () => {
  const testWorkspace = path.resolve(process.cwd(), '.tmp-test-webpack');

  beforeEach(async () => {
    await fsUtil.remove(testWorkspace);
    await fsUtil.ensureDir(path.join(testWorkspace, 'src', 'scripts'));
    await fsUtil.ensureDir(path.join(testWorkspace, 'src', 'styles'));
    await fsUtil.ensureDir(path.join(testWorkspace, 'src', 'images'));
  });

  afterEach(async () => {
    await fsUtil.remove(testWorkspace);
  });

  it('should transform JS with babel-loader when babel.config.cjs is present, including includeJsResource', async () => {
    await fsUtil.writeFile(
      path.join(testWorkspace, 'babel.config.cjs'),
      `module.exports = {
  plugins: [
    function markerPlugin({ types: t }) {
      return {
        visitor: {
          Identifier(p) {
            if (p.node.name === '__BALM_TEST_TOKEN__') {
              p.replaceWith(t.stringLiteral('transformed-by-babel'));
            }
          }
        }
      };
    }
  ]
};`
    );

    await fsUtil.writeFile(
      path.join(testWorkspace, 'extra-src', 'helper.js'),
      'export const helperToken = __BALM_TEST_TOKEN__;'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'scripts', 'main.js'),
      `import { helperToken } from '../../extra-src/helper.js';
console.log(__BALM_TEST_TOKEN__, helperToken);`
    );

    const config = resolveConfig({
      workspace: testWorkspace,
      env: {
        isProd: false,
        isDev: true,
        isTest: true,
        inFrontend: true,
        inSSR: false,
        inDesktopApp: false,
        isMP: false
      },
      scripts: {
        entry: path.join(testWorkspace, 'src', 'scripts', 'main.js'),
        includeJsResource: [path.join(testWorkspace, 'extra-src')]
      },
      logs: { level: 3 }
    });

    await runWebpack(config);

    const outJs = await fs.readFile(path.join(testWorkspace, '.tmp', 'js', 'main.js'), 'utf-8');
    expect(outJs).toContain('transformed-by-babel');
    expect(outJs).not.toContain('__BALM_TEST_TOKEN__');
  });

  it('should skip babel-loader when defaultLoaders.js is false even if babel.config.cjs exists', async () => {
    await fsUtil.writeFile(
      path.join(testWorkspace, 'babel.config.cjs'),
      `module.exports = {
  plugins: [
    function markerPlugin({ types: t }) {
      return {
        visitor: {
          Identifier(p) {
            if (p.node.name === '__SKIP_TOKEN__') {
              p.replaceWith(t.stringLiteral('should-not-run'));
            }
          }
        }
      };
    }
  ]
};`
    );

    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'scripts', 'main.js'),
      'const __SKIP_TOKEN__ = "raw-value"; console.log(__SKIP_TOKEN__);'
    );

    const config = resolveConfig({
      workspace: testWorkspace,
      env: {
        isProd: false,
        isDev: true,
        isTest: true,
        inFrontend: true,
        inSSR: false,
        inDesktopApp: false,
        isMP: false
      },
      scripts: {
        entry: path.join(testWorkspace, 'src', 'scripts', 'main.js'),
        defaultLoaders: { js: false }
      },
      logs: { level: 3 }
    });

    await runWebpack(config);

    const outJs = await fs.readFile(path.join(testWorkspace, '.tmp', 'js', 'main.js'), 'utf-8');
    expect(outJs).toContain('raw-value');
    expect(outJs).not.toContain('should-not-run');
  });

  it('should support css-loader, extractCss in production, html-loader, and url asset inlining with excludeUrlResource', async () => {
    const tinyPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'
    );
    await fs.writeFile(path.join(testWorkspace, 'src', 'images', 'tiny.png'), tinyPng);
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'icons', 'raw.svg'),
      '<svg viewBox="0 0 10 10"></svg>'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'scripts', 'partial.html'),
      '<div class="frag">hello</div>'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'scripts', 'style.css'),
      '.box { color: red; }'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'scripts', 'main.js'),
      `import './style.css';
import frag from './partial.html';
import pngUrl from '../images/tiny.png';
import rawSvg from '../icons/raw.svg';
console.log(frag, pngUrl, rawSvg);`
    );

    const config = resolveConfig({
      workspace: testWorkspace,
      env: {
        isProd: true,
        isDev: false,
        isTest: true,
        inFrontend: true,
        inSSR: false,
        inDesktopApp: false,
        isMP: false
      },
      scripts: {
        entry: path.join(testWorkspace, 'src', 'scripts', 'main.js'),
        extractCss: true,
        sourceMap: true,
        excludeUrlResource: [path.join(testWorkspace, 'src', 'icons')],
        loaders: [
          {
            test: /\.svg$/,
            include: [path.join(testWorkspace, 'src', 'icons')],
            type: 'asset/source'
          }
        ]
      },
      logs: { level: 3 }
    });

    await runWebpack(config);

    const outJs = await fs.readFile(path.join(testWorkspace, 'dist', 'js', 'main.js'), 'utf-8');
    const outCss = await fs.readFile(
      path.join(testWorkspace, 'dist', 'css', 'async', 'main.css'),
      'utf-8'
    );
    const hasMap = await fsUtil.exists(path.join(testWorkspace, 'dist', 'js', 'main.js.map'));

    const hasCssMap = await fsUtil.exists(
      path.join(testWorkspace, 'dist', 'css', 'async', 'main.css.map')
    );

    expect(hasMap).toBe(true);
    expect(hasCssMap).toBe(true);
    expect(outCss).toContain('.box');
    expect(outCss).toContain('color: red');
    expect(outJs).toContain('<div class="frag">hello</div>');
    expect(outJs).toContain('data:image/png;base64,');
    expect(outJs).toContain('<svg viewBox="0 0 10 10"></svg>');
  });

  it('should support library/libraryTarget UMD and extractAllVendors with custom vendorName', async () => {
    await fsUtil.writeFile(
      path.join(testWorkspace, 'node_modules', 'fake-vendor-pkg', 'package.json'),
      JSON.stringify({ name: 'fake-vendor-pkg', main: 'index.js' })
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'node_modules', 'fake-vendor-pkg', 'index.js'),
      `export const vendorValue = "from-fake-vendor";\nexport const padding = "${'x'.repeat(25000)}";`
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'scripts', 'main.js'),
      `import { vendorValue } from 'fake-vendor-pkg';
export function getVal() { return vendorValue; }`
    );

    const config = resolveConfig({
      workspace: testWorkspace,
      env: {
        isProd: false,
        isDev: true,
        isTest: true,
        inFrontend: true,
        inSSR: false,
        inDesktopApp: false,
        isMP: false
      },
      scripts: {
        entry: path.join(testWorkspace, 'src', 'scripts', 'main.js'),
        library: 'MyTestLib',
        libraryTarget: 'umd',
        extractAllVendors: true,
        vendorName: 'custom-vendor'
      },
      logs: { level: 3 }
    });

    await runWebpack(config);

    const vendorJsPath = path.join(testWorkspace, '.tmp', 'js', 'custom-vendor.js');
    const mainJsPath = path.join(testWorkspace, '.tmp', 'js', 'main.js');
    expect(await fsUtil.exists(vendorJsPath)).toBe(true);

    const vendorJs = await fs.readFile(vendorJsPath, 'utf-8');
    const mainJs = await fs.readFile(mainJsPath, 'utf-8');
    expect(vendorJs).toContain('from-fake-vendor');
    expect(mainJs).toContain('MyTestLib');
  });

  it('should exclude .vue.html from default html rule and preserve RegExp in deepMerge', async () => {
    const merged = deepMerge(
      {},
      { splitChunks: { cacheGroups: { vendors: { test: /node_modules/ } } } },
      { splitChunks: { cacheGroups: { vendors: { name: 'v' } } } }
    );
    expect(merged.splitChunks.cacheGroups.vendors.test).toBeInstanceOf(RegExp);

    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'scripts', 'main.js'),
      'export const plain = 42;'
    );

    let htmlRule: any;
    const config = resolveConfig({
      workspace: testWorkspace,
      env: {
        isProd: false,
        isDev: true,
        isTest: true,
        inFrontend: true,
        inSSR: false,
        inDesktopApp: false,
        isMP: false
      },
      scripts: {
        entry: path.join(testWorkspace, 'src', 'scripts', 'main.js'),
        plugins: [
          {
            apply(compiler: any) {
              htmlRule = compiler.options.module.rules.find(
                (r: any) => r.test instanceof RegExp && r.test.test('index.html')
              );
            }
          }
        ]
      },
      logs: { level: 3 }
    });

    await runWebpack(config);
    expect(htmlRule).toBeDefined();
    expect(htmlRule.exclude).toBeInstanceOf(RegExp);
    expect(htmlRule.exclude.test('Component.vue.html')).toBe(true);
  });
});

describe('FileWatcher Extensions', () => {
  const testWorkspace = path.resolve(process.cwd(), '.tmp-test-watcher');

  beforeEach(async () => {
    await fsUtil.remove(testWorkspace);
    await fsUtil.ensureDir(path.join(testWorkspace, 'src', 'scripts'));
    await fsUtil.ensureDir(path.join(testWorkspace, 'extra-js', 'nested'));
    await fsUtil.ensureDir(path.join(testWorkspace, 'extra-styles'));
  });

  afterEach(async () => {
    await fsUtil.remove(testWorkspace);
  });

  it('should deduplicate nested watch directories and trigger script rebuild for .vue, .md, and .json changes', async () => {
    const config = resolveConfig({
      workspace: testWorkspace,
      scripts: {
        includeJsResource: [
          path.join(testWorkspace, 'extra-js'),
          path.join(testWorkspace, 'extra-js', 'nested')
        ]
      },
      styles: {
        atImportPaths: [path.join(testWorkspace, 'extra-styles')]
      },
      logs: { level: 3 }
    });

    const broadcasts: Array<{ type: string; file?: string }> = [];
    const watcher = new FileWatcher(config, (data) => broadcasts.push(data));
    const scriptRunSpy = vi
      .spyOn((watcher as any).scriptTask, 'run')
      .mockResolvedValue(undefined);

    const watchDirs = (watcher as any).getWatchDirs() as string[];
    expect(watchDirs).toContain(config.src.base);
    expect(watchDirs).toContain(path.join(testWorkspace, 'extra-js'));
    expect(watchDirs).toContain(path.join(testWorkspace, 'extra-styles'));
    expect(watchDirs).not.toContain(path.join(testWorkspace, 'extra-js', 'nested'));

    for (const filename of ['Comp.vue', 'README.md', 'data.json']) {
      (watcher as any).pendingFiles.add(filename);
      await (watcher as any).handleChanges();
    }

    expect(scriptRunSpy).toHaveBeenCalledTimes(3);
    expect(broadcasts.filter((b) => b.type === 'reload')).toHaveLength(3);

    watcher.stop();
  });
});
