import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import http from 'node:http';
import path from 'node:path';
import balm, {
  HtmlTask,
  balm as balmInstance,
  resolveConfig,
  createDevServerApp,
  file as fsUtil
} from 'balm-core';

async function httpRequest(
  server: http.Server,
  requestPath: string,
  options: { method?: string; headers?: Record<string, string> } = {}
): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }> {
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Server is not listening on an ephemeral TCP port');
  }

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: address.port,
        path: requestPath,
        method: options.method || 'GET',
        headers: options.headers
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        res.on('end', () => {
          resolve({
            status: res.statusCode || 0,
            headers: res.headers,
            body: Buffer.concat(chunks).toString('utf8')
          });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

describe('HTML History Mode & Auxiliary Templates', () => {
  const testWorkspace = path.resolve(process.cwd(), '.tmp-test-html-history');

  beforeEach(async () => {
    await fsUtil.ensureDir(testWorkspace);
  });

  afterEach(async () => {
    balmInstance.reset();
    await fsUtil.remove(testWorkspace);
  });

  it('should emit dist/404.html without entry scripts/analytics and ignore stale root index.html when custom template is set', async () => {
    await fsUtil.writeFile(
      path.join(testWorkspace, 'docs/scripts/main.js'),
      'console.log("app boot");'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'docs/templates/index.html'),
      [
        '<!DOCTYPE html>',
        '<html>',
        '<head><title>Custom Template</title><link rel="icon" href="%PUBLIC_URL%/favicon.ico"></head>',
        '<body><div id="app">TEMPLATE_MARKER</div></body>',
        '</html>'
      ].join('\n')
    );
    // Simulate a leftover generated index.html from legacy tooling
    await fsUtil.writeFile(
      path.join(testWorkspace, 'docs/index.html'),
      '<!DOCTYPE html><html><body>STALE_INDEX_MARKER</body></html>'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'docs/404.html'),
      [
        '<!DOCTYPE html>',
        '<html>',
        '<head>',
        '  <meta charset="utf-8">',
        '  <link rel="icon" href="%PUBLIC_URL%/favicon.ico">',
        '  <script>',
        '    var l = window.location;',
        '    l.replace(l.protocol + "//" + l.hostname + "/?/" + l.pathname.slice(1));',
        '  </script>',
        '</head>',
        '<body></body>',
        '</html>'
      ].join('\n')
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'docs/service-worker.js'),
      [
        'import { precacheAndRoute } from "workbox-precaching";',
        'precacheAndRoute(self.__WB_MANIFEST);'
      ].join('\n')
    );

    balm.config = {
      workspace: testWorkspace,
      roots: {
        source: 'docs',
        tmp: '.tmp',
        target: 'dist'
      },
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
        entry: path.join(testWorkspace, 'docs/scripts/main.js'),
        injectHtml: true,
        htmlPluginOptions: {
          template: './docs/templates/index.html'
        }
      },
      html: {
        analytics: {
          google: 'G-TEST1234'
        }
      },
      assets: {
        cache: true
      },
      pwa: {
        enabled: true,
        mode: 'injectManifest',
        swSrcFilename: 'service-worker.js',
        swDestFilename: 'sw.js',
        options: {
          globIgnores: ['404.html']
        }
      },
      logs: {
        level: 4
      }
    };

    await balm.go();

    const distDir = path.join(testWorkspace, 'dist');
    const distIndex = await fsUtil.readFile(path.join(distDir, 'index.html'));
    const dist404Path = path.join(distDir, '404.html');
    const distSwPath = path.join(distDir, 'sw.js');

    expect(await fsUtil.exists(dist404Path)).toBe(true);
    const dist404 = await fsUtil.readFile(dist404Path);
    const distSw = await fsUtil.readFile(distSwPath);

    // index.html comes from custom template with injected bundle & analytics
    expect(distIndex).toContain('TEMPLATE_MARKER');
    expect(distIndex).not.toContain('STALE_INDEX_MARKER');
    expect(distIndex).toMatch(/\/js\/main\.[a-f0-9]+\.js/);
    expect(distIndex).toContain('G-TEST1234');
    expect(distIndex).not.toContain('%PUBLIC_URL%');

    // 404.html is emitted cleanly without app bundle scripts or analytics
    expect(dist404).toContain('window.location');
    expect(dist404).not.toContain('%PUBLIC_URL%');
    expect(dist404).not.toMatch(/\/js\/main/);
    expect(dist404).not.toContain('G-TEST1234');

    // sw.js respects globIgnores for 404.html
    expect(distSw).toContain('index.html');
    expect(distSw).not.toContain('404.html');
  });

  it('should emit .tmp/404.html without live reload script in dev mode', async () => {
    await fsUtil.writeFile(
      path.join(testWorkspace, 'docs/templates/index.html'),
      '<!DOCTYPE html><html><head></head><body><div id="app">DEV_TEMPLATE</div></body></html>'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'docs/index.html'),
      '<!DOCTYPE html><html><body>STALE_DEV_INDEX</body></html>'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'docs/404.html'),
      '<!DOCTYPE html><html><head><link href="%PUBLIC_URL%/favicon.ico"></head><body>NOT_FOUND_REDIRECT</body></html>'
    );

    const config = resolveConfig({
      workspace: testWorkspace,
      roots: {
        source: 'docs',
        tmp: '.tmp',
        target: 'dist'
      },
      env: {
        isProd: false,
        isDev: true,
        isTest: true
      },
      scripts: {
        entry: path.join(testWorkspace, 'docs/scripts/main.js'),
        injectHtml: true,
        htmlPluginOptions: {
          template: './docs/templates/index.html'
        }
      }
    });

    const htmlTask = new HtmlTask();
    await htmlTask.run(config);

    const tmpIndex = await fsUtil.readFile(path.join(testWorkspace, '.tmp/index.html'));
    const tmp404 = await fsUtil.readFile(path.join(testWorkspace, '.tmp/404.html'));

    expect(tmpIndex).toContain('DEV_TEMPLATE');
    expect(tmpIndex).not.toContain('STALE_DEV_INDEX');
    expect(tmpIndex).toContain('BalmJS Live Reload');
    expect(tmpIndex).toContain('/js/main.js');

    expect(tmp404).toContain('NOT_FOUND_REDIRECT');
    expect(tmp404).not.toContain('%PUBLIC_URL%');
    expect(tmp404).not.toContain('BalmJS Live Reload');
    expect(tmp404).not.toContain('/js/main.js');
  });

  it('should skip entry scripts for 404.html when custom template is not configured', async () => {
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src/index.html'),
      '<!DOCTYPE html><html><body>HOME_PAGE</body></html>'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'src/404.html'),
      '<!DOCTYPE html><html><body>ERROR_PAGE</body></html>'
    );

    const config = resolveConfig({
      workspace: testWorkspace,
      env: {
        isProd: true,
        isDev: false,
        isTest: true
      },
      scripts: {
        injectHtml: true
      },
      html: {
        analytics: {
          google: 'G-STD1234'
        }
      }
    });

    const htmlTask = new HtmlTask();
    await htmlTask.run(config);

    const distIndex = await fsUtil.readFile(path.join(testWorkspace, 'dist/index.html'));
    const dist404 = await fsUtil.readFile(path.join(testWorkspace, 'dist/404.html'));

    expect(distIndex).toContain('/js/main.js');
    expect(distIndex).toContain('G-STD1234');
    expect(dist404).toContain('ERROR_PAGE');
    expect(dist404).not.toContain('/js/main.js');
    expect(dist404).not.toContain('G-STD1234');
  });

  it('should serve SPA index on H5 history routes before directory static mounts', async () => {
    await fsUtil.writeFile(
      path.join(testWorkspace, '.tmp/index.html'),
      '<!DOCTYPE html><html><body>DEV_TMP_INDEX</body></html>'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, 'docs/index.html'),
      '<!DOCTYPE html><html><body>STALE_SRC_INDEX</body></html>'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, '.tmp/404.html'),
      '<!DOCTYPE html><html><body>DEV_404_PAGE</body></html>'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, '.tmp/css/app.css'),
      'body { color: red; }'
    );
    // Directory matching both paths.source.css ('styles') and SPA route ('/styles')
    await fsUtil.writeFile(
      path.join(testWorkspace, 'docs/styles/global.scss'),
      'body { margin: 0; }'
    );

    const config = resolveConfig({
      workspace: testWorkspace,
      roots: {
        source: 'docs',
        tmp: '.tmp',
        target: 'dist'
      },
      paths: {
        source: {
          css: 'styles'
        }
      },
      env: {
        isProd: false,
        isDev: true,
        isTest: true
      },
      server: {
        historyOptions: true
      }
    });

    const app = createDevServerApp(config);
    const server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));

    try {
      // Standard SPA route fallback
      const routeRes = await httpRequest(server, '/containment/image-list', {
        headers: { accept: 'text/html,application/xhtml+xml' }
      });
      expect(routeRes.status).toBe(200);
      expect(routeRes.body).toContain('DEV_TMP_INDEX');
      expect(routeRes.body).not.toContain('STALE_SRC_INDEX');

      // SPA route matching an existing folder/static mount (/styles) must not 301 redirect
      const folderRouteRes = await httpRequest(server, '/styles', {
        headers: { accept: 'text/html' }
      });
      expect(folderRouteRes.status).toBe(200);
      expect(folderRouteRes.body).toContain('DEV_TMP_INDEX');

      const nestedFolderRoute = await httpRequest(server, '/styles/color', {
        headers: { accept: 'text/html' }
      });
      expect(nestedFolderRoute.status).toBe(200);
      expect(nestedFolderRoute.body).toContain('DEV_TMP_INDEX');

      // Dot inside query string must not skip history fallback
      const queryDotRes = await httpRequest(server, '/?/containment/image-list&ver=1.2', {
        headers: { accept: 'text/html' }
      });
      expect(queryDotRes.status).toBe(200);
      expect(queryDotRes.body).toContain('DEV_TMP_INDEX');

      // HEAD request returns 200 with HTML header and empty body
      const headRes = await httpRequest(server, '/containment/image-list', {
        method: 'HEAD',
        headers: { accept: 'text/html' }
      });
      expect(headRes.status).toBe(200);
      expect(headRes.headers['content-type']).toContain('text/html');
      expect(headRes.body).toBe('');

      // Real asset with extension goes to serveStatic, not history fallback
      const cssRes = await httpRequest(server, '/styles/app.css', {
        headers: { accept: 'text/css,*/*;q=0.1' }
      });
      expect(cssRes.status).toBe(200);
      expect(cssRes.body).toContain('color: red');

      // Explicit /404.html still serves 404.html instead of index.html
      const notFoundHtmlRes = await httpRequest(server, '/404.html', {
        headers: { accept: 'text/html' }
      });
      expect(notFoundHtmlRes.status).toBe(200);
      expect(notFoundHtmlRes.body).toContain('DEV_404_PAGE');

      // Non-GET/HEAD request skips history fallback
      const postRes = await httpRequest(server, '/containment/image-list', {
        method: 'POST',
        headers: { accept: 'text/html' }
      });
      expect(postRes.status).toBe(404);
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve()))
      );
    }
  });

  it('should honor historyOptions object settings (rewrites, disableDotRule, index)', async () => {
    await fsUtil.writeFile(
      path.join(testWorkspace, '.tmp/app.html'),
      '<!DOCTYPE html><html><body>CUSTOM_APP_HTML</body></html>'
    );
    await fsUtil.writeFile(
      path.join(testWorkspace, '.tmp/admin.html'),
      '<!DOCTYPE html><html><body>ADMIN_HTML</body></html>'
    );

    const config = resolveConfig({
      workspace: testWorkspace,
      env: {
        isProd: false,
        isDev: true,
        isTest: true
      },
      server: {
        historyOptions: {
          index: '/app.html',
          disableDotRule: true,
          rewrites: [
            {
              from: /^\/admin/,
              to: '/admin.html'
            }
          ]
        }
      }
    });

    const app = createDevServerApp(config);
    const server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));

    try {
      const dotRouteRes = await httpRequest(server, '/users/john.doe', {
        headers: { accept: 'text/html' }
      });
      expect(dotRouteRes.status).toBe(200);
      expect(dotRouteRes.body).toContain('CUSTOM_APP_HTML');

      const adminRes = await httpRequest(server, '/admin/dashboard', {
        headers: { accept: 'text/html' }
      });
      expect(adminRes.status).toBe(200);
      expect(adminRes.body).toContain('ADMIN_HTML');
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve()))
      );
    }
  });
});
