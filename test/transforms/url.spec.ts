import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import balm, {
  resolveConfig,
  Pipeline,
  transformCssUrl,
  rewriteCssAssetUrls,
  rewriteHtmlAssetPaths,
  isManifestFile,
  file as fsUtil
} from 'balm-core';

describe('Asset URL & Path Rewriting', () => {
  const testWorkspace = path.resolve(process.cwd(), '.tmp-test-url');

  beforeEach(async () => {
    balm.reset();
    await fsUtil.ensureDir(testWorkspace);
  });

  afterEach(async () => {
    await fsUtil.remove(testWorkspace);
  });

  it('should rewrite relative and root-relative CSS asset URLs in production', () => {
    const config = resolveConfig(
      {
        env: { isProd: true },
        paths: {
          source: { img: 'images', font: 'fonts', media: 'assets/media' },
          target: { img: 'img', font: 'font', media: 'media' }
        }
      },
      testWorkspace
    );

    const input = [
      "@font-face { src: url('../fonts/material-icons.woff2') format('woff2'), url(../fonts/material-icons.woff) format('woff'); }",
      '@font-face { src: url(https://example.com/fonts/a.woff2), url(//cdn.example.com/fonts/b.woff2), url(/fonts/local.woff); }',
      '.bg { background-image: url("../images/hero.png"); }',
      '.nested { background: url(../../images/card.jpg), url(\'/images/banner.jpg\'); }',
      '.inline-svg { background: url("data:image/svg+xml,%3Csvg%3E%3C/svg%3E"); }',
      '.video-poster { background: url(../assets/media/poster.png); }'
    ].join('\n');

    const output = rewriteCssAssetUrls(input, config);

    expect(output).toContain("url('../font/material-icons.woff2')");
    expect(output).toContain('url(../font/material-icons.woff)');
    expect(output).toContain('url(https://example.com/fonts/a.woff2)');
    expect(output).toContain('url(//cdn.example.com/fonts/b.woff2)');
    expect(output).toContain('url(/font/local.woff)');
    expect(output).toContain('url("../img/hero.png")');
    expect(output).toContain('url(../../img/card.jpg)');
    expect(output).toContain("url('/img/banner.jpg')");
    expect(output).toContain('url("data:image/svg+xml,%3Csvg%3E%3C/svg%3E")');
    expect(output).toContain('url(../media/poster.png)');
  });

  it('should rewrite CSS URLs in backend mode (inFrontend: false) and skip in frontend dev mode', () => {
    const devFrontendConfig = resolveConfig(
      {
        env: { isProd: false },
        inFrontend: true
      },
      testWorkspace
    );
    const devBackendConfig = resolveConfig(
      {
        env: { isProd: false },
        inFrontend: false
      },
      testWorkspace
    );

    const css = '@font-face { src: url(../fonts/icon.woff2); }';
    expect(rewriteCssAssetUrls(css, devFrontendConfig)).toBe(css);
    expect(rewriteCssAssetUrls(css, devBackendConfig)).toBe(
      '@font-face { src: url(../font/icon.woff2); }'
    );
  });

  it('should transform CSS files via transformCssUrl pipeline helper', async () => {
    const cssPath = path.join(testWorkspace, 'app.css');
    await fsUtil.writeFile(cssPath, '.icon { src: url(../fonts/app.woff2); }');

    const config = resolveConfig({ env: { isProd: true } }, testWorkspace);
    const pipeline = Pipeline.from(cssPath, { cwd: testWorkspace });
    pipeline.pipe(transformCssUrl(config));
    const files = await pipeline.process();

    expect(files[0].toString()).toContain('url(../font/app.woff2)');
  });

  it('should rewrite asset paths in HTML and manifest JSON while preserving external URLs', () => {
    const config = resolveConfig(
      {
        env: { isProd: true },
        assets: { virtualDir: 'docs' }
      },
      testWorkspace
    );

    const manifestJson = JSON.stringify(
      {
        icons: [
          { src: '/docs/images/icons/icon-144x144.png', sizes: '144x144' },
          { src: '/images/icons/icon-192x192.png', sizes: '192x192' },
          { src: 'images/icons/icon-512x512.png', sizes: '512x512' }
        ]
      },
      null,
      2
    );

    const rewrittenManifest = rewriteHtmlAssetPaths(manifestJson, config);
    expect(rewrittenManifest).toContain('"/docs/img/icons/icon-144x144.png"');
    expect(rewrittenManifest).toContain('"/img/icons/icon-192x192.png"');
    expect(rewrittenManifest).toContain('"img/icons/icon-512x512.png"');

    const html = [
      '<link rel="stylesheet" href="styles/main.css">',
      '<script src="/scripts/app.js"></script>',
      '<script src="https://cdn.example.com/scripts/vendor.js"></script>',
      '<img src="//cdn.example.com/images/ext.png">'
    ].join('\n');

    const rewrittenHtml = rewriteHtmlAssetPaths(html, config);
    expect(rewrittenHtml).toContain('href="css/main.css"');
    expect(rewrittenHtml).toContain('src="/js/app.js"');
    expect(rewrittenHtml).toContain('https://cdn.example.com/scripts/vendor.js');
    expect(rewrittenHtml).toContain('//cdn.example.com/images/ext.png');

    expect(
      isManifestFile({ basename: 'manifest.json', extname: '.json' }, config)
    ).toBe(true);
    expect(
      isManifestFile({ basename: 'site.webmanifest', extname: '.webmanifest' }, config)
    ).toBe(true);
    expect(
      isManifestFile({ basename: 'data.json', extname: '.json' }, config)
    ).toBe(false);
  });

  it('should rewrite CSS font/image URLs and manifest icons in end-to-end production build', async () => {
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'templates', 'index.html'),
      '<!doctype html><html><head><link rel="apple-touch-icon" href="%PUBLIC_URL%/images/icons/apple-touch-icon.png"><link rel="stylesheet" href="%PUBLIC_URL%/styles/main.css"></head><body><script src="%PUBLIC_URL%/scripts/main.js"></script></body></html>'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'manifest.json'),
      JSON.stringify(
        {
          name: 'TestApp',
          icons: [
            {
              src: '%PUBLIC_URL%/images/icons/icon-144x144.png',
              sizes: '144x144',
              type: 'image/png'
            }
          ]
        },
        null,
        2
      )
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'styles', 'main.scss'),
      "@font-face { font-family: 'Material Icons'; src: url('../fonts/material-icons.woff2') format('woff2'); }\n.hero { background-image: url('../images/hero.png'); }"
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'scripts', 'main.js'),
      'console.log("ok");'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'fonts', 'material-icons.woff2'),
      'mock-font-binary'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'fonts', '.DS_Store'),
      'mac-junk'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'images', 'hero.png'),
      'mock-hero-png'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'images', 'icons', 'icon-144x144.png'),
      'mock-icon-144'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'images', 'icons', 'apple-touch-icon.png'),
      'mock-apple-icon'
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
        bundler: 'esbuild',
        entry: path.join(testWorkspace, 'src', 'scripts', 'main.js'),
        htmlPluginOptions: {
          template: './src/templates/index.html'
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
    const revManifest = JSON.parse(
      await fsUtil.readFile(path.join(distDir, 'rev-manifest.json'))
    );
    const cssRelPath = revManifest['css/main.css'];
    const fontRelPath = revManifest['font/material-icons.woff2'];
    const heroRelPath = revManifest['img/hero.png'];

    expect(cssRelPath).toBeDefined();
    expect(fontRelPath).toMatch(/^font\/material-icons\.[a-f0-9]{8}\.woff2$/);
    expect(heroRelPath).toMatch(/^img\/hero\.[a-f0-9]{8}\.png$/);

    const cssContent = await fsUtil.readFile(path.join(distDir, cssRelPath));
    expect(cssContent).toContain(`../${fontRelPath}`);
    expect(cssContent).toContain(`../${heroRelPath}`);
    expect(cssContent).not.toContain('../fonts/');
    expect(cssContent).not.toContain('../images/');
    expect(await fsUtil.exists(path.join(distDir, fontRelPath))).toBe(true);
    expect(await fsUtil.exists(path.join(distDir, heroRelPath))).toBe(true);

    const manifestContent = await fsUtil.readFile(
      path.join(distDir, 'manifest.json')
    );
    expect(manifestContent).toContain('"/img/icons/icon-144x144.png"');
    expect(manifestContent).not.toContain('/images/');
    expect(
      await fsUtil.exists(path.join(distDir, 'img', 'icons', 'icon-144x144.png'))
    ).toBe(true);

    const htmlContent = await fsUtil.readFile(path.join(distDir, 'index.html'));
    expect(htmlContent).toContain('/img/icons/apple-touch-icon.png');
    expect(htmlContent).toContain(`/${cssRelPath}`);

    expect(
      await fsUtil.exists(path.join(distDir, 'font', '.DS_Store'))
    ).toBe(false);
  });

  it('should also preserve target asset paths in manifest.json when default HTML template pipeline runs', async () => {
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'index.html'),
      '<!doctype html><html><head></head><body><script src="%PUBLIC_URL%/scripts/main.js"></script></body></html>'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'manifest.json'),
      '{"icons":[{"src":"%PUBLIC_URL%/images/icons/icon-144x144.png"}]}'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'scripts', 'main.js'),
      'console.log("ok");'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src', 'images', 'icons', 'icon-144x144.png'),
      'mock-icon-144'
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
        bundler: 'esbuild',
        entry: path.join(testWorkspace, 'src', 'scripts', 'main.js')
      },
      pwa: {
        enabled: false,
        manifest: 'manifest.json'
      },
      logs: {
        level: 3
      }
    };

    await balm.go();

    const distManifest = await fsUtil.readFile(
      path.join(testWorkspace, 'dist', 'manifest.json')
    );
    expect(distManifest).toContain('"/img/icons/icon-144x144.png"');
    expect(distManifest).not.toContain('/images/');
  });
});
