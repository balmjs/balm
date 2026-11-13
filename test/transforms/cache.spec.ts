import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import balm, { AssetRevisioner, VirtualFile, file as fsUtil } from 'balm-core';
import fs from 'node:fs/promises';
import path from 'node:path';

async function collectJsFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectJsFiles(fullPath)));
    } else if (entry.name.endsWith('.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('Asset Revisioning & Cache Subsystem', () => {
  const testWorkspace = path.resolve(process.cwd(), '.tmp-test-cache');

  beforeEach(async () => {
    balm.reset();
    await fsUtil.ensureDir(testWorkspace);
  });

  afterEach(async () => {
    await fsUtil.remove(testWorkspace);
  });

  it('should hash assets, rewrite references in HTML/CSS, and generate manifest', () => {
    const base = '/test-app/dist';
    const cssFile = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'css', 'app.css'),
      contents: 'body { background: url("../img/logo.png"); }'
    });

    const imgFile = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'img', 'logo.png'),
      contents: 'binary-image-data'
    });

    const htmlFile = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'index.html'),
      contents: '<link rel="stylesheet" href="css/app.css"><img src="img/logo.png">'
    });

    const revisioner = new AssetRevisioner({
      fileNameManifest: 'rev-manifest.json',
      dontRenameFile: ['.html'],
      dontUpdateReference: []
    });

    const outputs = revisioner.process([cssFile, imgFile, htmlFile]);

    // Manifest should be created
    const manifestFile = outputs.find((f) => f.basename === 'rev-manifest.json');
    expect(manifestFile).toBeDefined();

    const manifest = JSON.parse(manifestFile!.toString());
    expect(manifest['img/logo.png']).toMatch(/img\/logo\.[a-f0-9]{8}\.png/);
    expect(manifest['css/app.css']).toMatch(/css\/app\.[a-f0-9]{8}\.css/);

    // HTML should reference new revised hashed filenames
    const outputHtml = outputs.find((f) => f.basename === 'index.html');
    expect(outputHtml!.toString()).not.toContain('logo.png');
    expect(outputHtml!.toString()).toMatch(/logo\.[a-f0-9]{8}\.png/);
  });

  it('should not cascade-hash numbered filenames or collide on substring filenames', () => {
    const base = '/test-app/dist';
    const img1 = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'img', '1.jpg'),
      contents: 'image-1'
    });
    const img13 = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'img', '13.jpg'),
      contents: 'image-13'
    });
    const img1Dash1 = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'img', '1-1.jpg'),
      contents: 'image-1-1'
    });
    const cssFile = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'css', 'app.css'),
      contents:
        '.a{background:url("../img/1.jpg")}.b{background:url("../img/13.jpg")}.c{background:url("../img/1-1.jpg")}'
    });

    const revisioner = new AssetRevisioner({ dontRenameFile: ['.html'] });
    const outputs = revisioner.process([img1, img13, img1Dash1, cssFile]);
    const manifest = JSON.parse(
      outputs.find((f) => f.basename === 'rev-manifest.json')!.toString()
    );
    const outCss = outputs.find((f) => f.relative.startsWith('css/'))!.toString();

    expect(outCss).toContain(`url("../${manifest['img/1.jpg']}")`);
    expect(outCss).toContain(`url("../${manifest['img/13.jpg']}")`);
    expect(outCss).toContain(`url("../${manifest['img/1-1.jpg']}")`);
    expect(outCss).not.toMatch(/\.[a-f0-9]{8}\.[a-f0-9]{8}\./);
  });

  it('should not rewrite already-hashed bundler assets via basename or corrupt ambiguous basenames', () => {
    const base = '/test-app/dist';
    // Two webpack-emitted images whose unhashed names collide as img/1.jpg
    const wpImg2x3 = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'img', '1.859e0c2f.jpg'),
      contents: 'wp-2x3-1'
    });
    const wpImg3x2 = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'img', '1.0fb9c0ac.jpg'),
      contents: 'wp-3x2-1'
    });
    const wpImg13 = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'img', '13.975a9bf1.jpg'),
      contents: 'wp-3x2-13'
    });
    const wpUniqueCard = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'img', 'card-media-h.e728c270.png'),
      contents: 'wp-card'
    });
    // Ambiguous static assets sharing basename icon.png
    const staticIconA = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'img', 'a', 'icon.png'),
      contents: 'icon-a'
    });
    const staticIconB = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'img', 'b', 'icon.png'),
      contents: 'icon-b'
    });

    const htmlFile = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'index.html'),
      contents: [
        '<img src="img/a/icon.png">',
        '<img src="img/b/icon.png">',
        '<code>./assets/card-media-h.png</code>',
        '<code>./assets/photos/2x3/1.jpg</code>',
        '<code>./assets/photos/3x2/13.jpg</code>',
        '<span data-bare="icon.png"></span>'
      ].join('')
    });

    const jsChunk = new VirtualFile({
      cwd: '/test-app',
      base,
      path: path.join(base, 'js', 'chunk', '1184.994d1f7c.js'),
      contents:
        'var map={"./assets/photos/2x3/1.jpg":[4649],"./assets/photos/3x2/13.jpg":[7234],"./assets/card-media-h.png":[555]};var s="img/13.975a9bf1.jpg";'
    });

    const revisioner = new AssetRevisioner({
      dontRenameFile: ['.html', 'js/**/*'],
      dontUpdateReference: ['js/**/*']
    });
    const outputs = revisioner.process([
      wpImg2x3,
      wpImg3x2,
      wpImg13,
      wpUniqueCard,
      staticIconA,
      staticIconB,
      htmlFile,
      jsChunk
    ]);

    const manifest = JSON.parse(
      outputs.find((f) => f.basename === 'rev-manifest.json')!.toString()
    );
    const outHtml = outputs.find((f) => f.basename === 'index.html')!.toString();
    const outChunk = outputs
      .find((f) => f.relative === 'js/chunk/1184.994d1f7c.js')!
      .toString();

    expect(outChunk).toContain('"./assets/photos/2x3/1.jpg"');
    expect(outChunk).toContain('"./assets/photos/3x2/13.jpg"');
    expect(outChunk).toContain('"./assets/card-media-h.png"');
    expect(outChunk).toContain('"img/13.975a9bf1.jpg"');
    expect(outChunk).not.toMatch(/\.[a-f0-9]{8}\.[a-f0-9]{8}\./);

    expect(outHtml).toContain(`src="${manifest['img/a/icon.png']}"`);
    expect(outHtml).toContain(`src="${manifest['img/b/icon.png']}"`);
    expect(outHtml).toContain('./assets/card-media-h.png');
    expect(outHtml).toContain('./assets/photos/2x3/1.jpg');
    expect(outHtml).toContain('./assets/photos/3x2/13.jpg');
    expect(outHtml).toContain('data-bare="icon.png"');
    expect(manifest['img/1.jpg']).toBeUndefined();
  });

  it('should preserve webpack dynamic import context maps while caching static CSS assets', async () => {
    const scriptsDir = path.join(testWorkspace, 'src', 'scripts');
    const photos2x3Dir = path.join(scriptsDir, 'assets', 'photos', '2x3');
    const photos3x2Dir = path.join(scriptsDir, 'assets', 'photos', '3x2');
    const stylesDir = path.join(testWorkspace, 'src', 'styles');
    const imagesDir = path.join(testWorkspace, 'src', 'images');

    await fsUtil.ensureDir(photos2x3Dir);
    await fsUtil.ensureDir(photos3x2Dir);
    await fsUtil.ensureDir(stylesDir);
    await fsUtil.ensureDir(imagesDir);

    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'index.html'),
      '<!DOCTYPE html><html><head><link rel="stylesheet" href="%PUBLIC_URL%/styles/main.css"></head><body></body></html>'
    );
    await fsUtil.writeFile(
      path.join(stylesDir, 'main.scss'),
      '.hero { background: url("../images/hero.png"); }'
    );
    await fsUtil.writeFile(path.join(imagesDir, 'hero.png'), 'static-hero-png');

    await fsUtil.writeFile(path.join(photos2x3Dir, '1.jpg'), Buffer.alloc(10240, 0x41));
    await fsUtil.writeFile(path.join(photos3x2Dir, '1.jpg'), Buffer.alloc(10240, 0x42));
    await fsUtil.writeFile(path.join(photos3x2Dir, '13.jpg'), Buffer.alloc(10240, 0x43));

    await fsUtil.writeFile(
      path.join(scriptsDir, 'main.js'),
      [
        'export async function loadPhoto(key) {',
        '  const mod = await import(`./assets/photos/${key}.jpg`);',
        '  return mod.default;',
        '}',
        "console.log(loadPhoto('2x3/1'), loadPhoto('3x2/1'), loadPhoto('3x2/13'));"
      ].join('\n')
    );

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
        bundler: 'webpack',
        injectHtml: true,
        entry: {
          app: path.join(scriptsDir, 'main.js')
        }
      },
      assets: {
        cache: true
      },
      logs: {
        level: 3
      }
    };

    await balm.go();

    const distDir = path.join(testWorkspace, 'dist');
    const jsFiles = await collectJsFiles(path.join(distDir, 'js'));
    const allJsContent = (
      await Promise.all(jsFiles.map((f) => fsUtil.readFile(f)))
    ).join('\n');

    expect(allJsContent).toContain('./2x3/1.jpg');
    expect(allJsContent).toContain('./3x2/1.jpg');
    expect(allJsContent).toContain('./3x2/13.jpg');
    expect(allJsContent).not.toMatch(/\.jpg\.[a-f0-9]{8}|\.[a-f0-9]{8}\.[a-f0-9]{8}\.jpg/);

    // Verify chunk asset references correspond to actual files in dist/img/
    const imgMatches = [...allJsContent.matchAll(/img\/([0-9]+\.[a-f0-9]{8}\.jpg)/g)].map(
      (m) => m[1]
    );
    expect(imgMatches.length).toBeGreaterThanOrEqual(3);
    for (const imgName of imgMatches) {
      expect(await fsUtil.exists(path.join(distDir, 'img', imgName))).toBe(true);
    }

    // Verify static CSS and static image were hashed and linked in index.html
    const manifest = JSON.parse(
      await fsUtil.readFile(path.join(distDir, 'rev-manifest.json'))
    );
    expect(manifest['css/main.css']).toMatch(/^css\/main\.[a-f0-9]{8}\.css$/);
    expect(manifest['img/hero.png']).toMatch(/^img\/hero\.[a-f0-9]{8}\.png$/);

    const htmlContent = await fsUtil.readFile(path.join(distDir, 'index.html'));
    expect(htmlContent).toContain(manifest['css/main.css']);
  }, 20000);
});
