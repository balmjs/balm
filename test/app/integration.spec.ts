import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import balm, { file as fsUtil } from 'balm-core';
import path from 'node:path';

describe('End-to-End Build Integration Workflow', () => {
  const testWorkspace = path.resolve(process.cwd(), '.tmp-test-e2e');

  beforeEach(async () => {
    balm.reset();
    await fsUtil.ensureDir(testWorkspace);

    // Setup source project structure
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'index.html'),
      '<!DOCTYPE html><html><head><link rel="stylesheet" href="styles/main.css"></head><body><h1>Hello E2E</h1><script src="scripts/main.js"></script></body></html>'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'styles', 'main.scss'),
      '$primary: #2563eb; body { background: $primary; }'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'scripts', 'main.js'),
      'console.log("Balm 6.x E2E App");'
    );
  });

  afterEach(async () => {
    await fsUtil.remove(testWorkspace);
  });

  it('should run production build compiling Sass, bundling JS with ESBuild, minifying HTML, and revisioning assets', async () => {
    balm.config = {
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
        bundler: 'esbuild',
        entry: path.join(testWorkspace, 'src', 'scripts', 'main.js')
      },
      assets: {
        cache: true
      },
      logs: {
        level: 3
      }
    };

    let beforeCalled = false;
    let afterCalled = false;
    balm.beforeTask = () => { beforeCalled = true; };
    balm.afterTask = () => { afterCalled = true; };

    await balm.go();

    expect(beforeCalled).toBe(true);
    expect(afterCalled).toBe(true);

    const distDir = path.join(testWorkspace, 'dist');
    expect(await fsUtil.exists(distDir)).toBe(true);
    expect(await fsUtil.exists(path.join(distDir, 'index.html'))).toBe(true);
    expect(await fsUtil.exists(path.join(distDir, 'rev-manifest.json'))).toBe(true);

    const htmlContent = await fsUtil.readFile(path.join(distDir, 'index.html'));
    expect(htmlContent).toContain('<h1>Hello E2E</h1>');
  });
});
