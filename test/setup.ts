import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect } from 'chai';
import balm from '../packages/balm-core/src/index.js';

const isWin = process.platform === 'win32';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const workspace = path.join(projectRoot, 'test-workspace');

balm.config = {
  workspace
};

function asyncCase(fn: Function): () => Promise<void> {
  return async (): Promise<void> => {
    await fn();
  };
}

import {
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  describe,
  it
} from 'vitest';

const balmConfigDefaults = Object.assign(
  {},
  {
    env: {
      isProd: false,
      isDev: false,
      inSSR: false,
      isMP: false,
      inDesktopApp: false
    },
    inFrontend: true,
    paths: {
      target: {
        css: 'css',
        js: 'js',
        img: 'img',
        font: 'font',
        media: 'media'
      }
    },
    styles: {
      extname: 'css',
      sprites: []
    },
    scripts: {
      bundler: 'webpack',
      entry: '',
      library: '',
      loaders: [],
      plugins: [],
      injectHtml: false,
      htmlPluginOptions: {},
      extractCss: false,
      sourceMap: false,
      target: ['web', 'es5'],
      externals: false,
      extractAllVendors: false,
      bundleAnalyzerReport: false
    },
    extras: {
      includes: [],
      excludes: []
    },
    assets: {
      publicUrl: '',
      root: path.join(workspace, 'assets'),
      subDir: '',
      buildDir: 'build',
      cache: false,
      options: {
        fileNameManifest: 'rev-manifest.json',
        dontRenameFile: ['.html'],
        dontUpdateReference: ['.html']
      },
      includes: [],
      excludes: []
    },
    server: {
      proxyOptions: false,
      historyOptions: false
    },
    pwa: {
      enabled: false
    },
    logs: {
      level: 3
    }
  }
);

const wrapHook = (hook: Function) => {
  return (fn: Function, timeout?: number) => {
    if (!fn) return hook(fn);
    if (fn.length > 0) {
      return hook(
        () =>
          new Promise<void>((resolve, reject) => {
            try {
              const res = fn((err?: any) => {
                if (err) reject(err);
                else resolve();
              });
              if (res && typeof res.then === 'function') {
                res.then(resolve, reject);
              }
            } catch (e) {
              reject(e);
            }
          }),
        timeout
      );
    }
    return hook(fn, timeout);
  };
};

const customIt = (name: string, fn?: Function, timeout?: number) => {
  if (!fn) return it(name);
  if (fn.length > 0) {
    return it(
      name,
      () =>
        new Promise<void>((resolve, reject) => {
          try {
            const res = fn((err?: any) => {
              if (err) reject(err);
              else resolve();
            });
            if (res && typeof res.then === 'function') {
              res.then(resolve, reject);
            }
          } catch (e) {
            reject(e);
          }
        }),
      timeout
    );
  }
  return it(name, fn as any, timeout);
};

(globalThis as any).isWin = isWin;
(globalThis as any).balm = balm;
(globalThis as any).expect = expect;
(globalThis as any).asyncCase = asyncCase;
(globalThis as any).context = describe;
(globalThis as any).before = wrapHook(beforeAll);
(globalThis as any).after = wrapHook(afterAll);
(globalThis as any).beforeEach = wrapHook(beforeEach);
(globalThis as any).afterEach = wrapHook(afterEach);
(globalThis as any).describe = describe;
(globalThis as any).it = customIt;

afterEach(function () {
  balm.config = balmConfigDefaults;
  balm.reset();
});


