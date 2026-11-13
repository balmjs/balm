import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import connect from 'connect';
import serveStatic from 'serve-static';
import { WebSocketServer, WebSocket } from 'ws';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { BaseTask } from '../runner/task.js';
import { BalmConfig } from '../types/index.js';
import { FileWatcher } from '../watcher/index.js';
import { logger } from '../utilities/logger.js';
import pc from 'picocolors';

export interface HistoryRewriteRule {
  from: RegExp | string;
  to:
    | string
    | ((context: {
        parsedUrl: URL;
        match: RegExpMatchArray;
        request: any;
      }) => string);
}

export interface HistoryFallbackOptions {
  index?: string;
  disableDotRule?: boolean;
  htmlAcceptHeaders?: string[];
  rewrites?: HistoryRewriteRule[];
}

function resolveServedFile(config: BalmConfig, targetPath: string): string | null {
  const normalizedTarget = targetPath.split('?')[0].replace(/^\/+/, '');
  const candidates = [
    path.join(config.dest.html, normalizedTarget),
    path.join(config.dest.base, normalizedTarget),
    path.join(config.src.base, normalizedTarget)
  ];

  return (
    candidates.find((filePath) => {
      try {
        return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
      } catch {
        return false;
      }
    }) || null
  );
}

export function createHistoryFallbackMiddleware(config: BalmConfig) {
  const rawOptions = config.server.historyOptions;
  const opts: HistoryFallbackOptions =
    rawOptions && typeof rawOptions === 'object' ? rawOptions : {};
  const defaultIndex = typeof opts.index === 'string' ? opts.index : '/index.html';
  const htmlAcceptHeaders = Array.isArray(opts.htmlAcceptHeaders)
    ? opts.htmlAcceptHeaders
    : ['text/html', 'application/xhtml+xml'];
  const rewrites = Array.isArray(opts.rewrites) ? opts.rewrites : [];

  return (req: any, res: any, next: any) => {
    const isGetOrHead = req.method === 'GET' || req.method === 'HEAD';
    if (!isGetOrHead || !req.url) {
      return next();
    }

    const accept = req.headers?.accept;
    const isHtmlAccept =
      typeof accept === 'string' &&
      htmlAcceptHeaders.some((header) => accept.includes(header));
    if (!isHtmlAccept) {
      return next();
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(req.url, 'http://localhost');
    } catch {
      return next();
    }

    const { pathname } = parsedUrl;

    // Evaluate custom rewrites first, matching connect-history-api-fallback semantics
    let rewriteTarget: string | null = null;
    for (const rule of rewrites) {
      const match =
        rule.from instanceof RegExp
          ? pathname.match(rule.from)
          : pathname === rule.from
            ? ([pathname] as unknown as RegExpMatchArray)
            : null;
      if (match) {
        rewriteTarget =
          typeof rule.to === 'function'
            ? rule.to({ parsedUrl, match, request: req })
            : rule.to;
        break;
      }
    }

    if (!rewriteTarget) {
      if (!opts.disableDotRule) {
        const lastSlash = pathname.lastIndexOf('/');
        const lastDot = pathname.lastIndexOf('.');
        if (lastDot > lastSlash) {
          return next();
        }
      }
      rewriteTarget = defaultIndex;
    }

    const fileToServe = resolveServedFile(config, rewriteTarget);
    if (fileToServe && /\.html?$/i.test(fileToServe)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      if (req.method === 'HEAD') {
        return res.end();
      }
      return fs.createReadStream(fileToServe).pipe(res);
    }

    req.url = rewriteTarget;
    return next();
  };
}

export function createDevServerApp(config: BalmConfig): ReturnType<typeof connect> {
  const app = connect();

  // Rewrite %PUBLIC_URL% in request URLs
  app.use((req: any, _res: any, next: any) => {
    if (req.url?.includes('%PUBLIC_URL%')) {
      req.url = req.url.replace('/%PUBLIC_URL%', '').replace('%PUBLIC_URL%', '') || '/';
    }
    next();
  });

  // Dynamic manifest.json replacement for %PUBLIC_URL%
  app.use((req: any, res: any, next: any) => {
    if (req.url === '/manifest.json' || req.url?.endsWith('/manifest.json')) {
      const candidates = [
        path.join(config.dest.base, 'manifest.json'),
        path.join(config.src.base, 'manifest.json'),
        path.join(config.workspace, 'manifest.json')
      ];
      const file = candidates.find((f) => fs.existsSync(f));
      if (file) {
        let content = fs.readFileSync(file, 'utf-8');
        const replacement = config.assets.virtualDir ? `/${config.assets.virtualDir}` : '';
        content = content.replaceAll('%PUBLIC_URL%', replacement);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.end(content);
      }
    }
    next();
  });

  // Proxy middleware must run before history fallback and static mounts
  if (config.server.proxy && typeof config.server.proxy === 'object') {
    const proxyEntries = Array.isArray(config.server.proxy)
      ? config.server.proxy
      : [config.server.proxy];

    for (const entry of proxyEntries) {
      if (entry.context && entry.options) {
        app.use(createProxyMiddleware({ pathFilter: entry.context, ...entry.options }));
      } else if (entry.target || entry.pathFilter) {
        app.use(createProxyMiddleware(entry));
      }
    }
  }

  // History API fallback must run before static mounts so SPA routes matching directories work
  if (config.server.historyOptions) {
    app.use(createHistoryFallbackMiddleware(config));
  }

  // Static assets routing
  if (config.paths.source.css) {
    app.use('/' + config.paths.source.css, serveStatic(config.dest.css));
  }
  if (config.paths.tmp.css && config.paths.tmp.css !== config.paths.source.css) {
    app.use('/' + config.paths.tmp.css, serveStatic(config.dest.css));
  }

  if (config.paths.source.js) {
    app.use('/' + config.paths.source.js, serveStatic(config.dest.js));
  }
  if (config.paths.tmp.js && config.paths.tmp.js !== config.paths.source.js) {
    app.use('/' + config.paths.tmp.js, serveStatic(config.dest.js));
  }
  app.use('/chunk', serveStatic(path.join(config.dest.js, 'chunk')));
  app.use('/chunk', serveStatic(path.join(config.dest.base, 'chunk')));

  if (config.paths.source.img) {
    app.use(
      '/' + config.paths.source.img,
      serveStatic(path.join(config.src.base, config.paths.source.img))
    );
  }
  if (config.paths.tmp.img) {
    app.use('/' + config.paths.tmp.img, serveStatic(config.dest.img));
  }
  app.use('/img', serveStatic(path.join(config.dest.base, 'img')));
  app.use('/img', serveStatic(path.join(config.dest.js, 'img')));

  if (config.paths.source.font) {
    app.use(
      '/' + config.paths.source.font,
      serveStatic(path.join(config.src.base, config.paths.source.font))
    );
  }
  if (config.paths.tmp.font) {
    app.use('/' + config.paths.tmp.font, serveStatic(config.dest.font));
  }
  app.use('/font', serveStatic(path.join(config.dest.base, 'font')));
  app.use('/font', serveStatic(path.join(config.dest.js, 'font')));
  app.use('/fonts', serveStatic(path.join(config.src.base, 'fonts')));
  app.use('/fonts', serveStatic(path.join(config.dest.base, 'fonts')));

  // Custom serveStatic routing
  if (config.server.serveStatic) {
    const staticEntries = Array.isArray(config.server.serveStatic)
      ? config.server.serveStatic
      : [config.server.serveStatic];

    for (const entry of staticEntries) {
      if (typeof entry === 'string') {
        const absoluteDir = path.isAbsolute(entry)
          ? entry
          : path.join(config.workspace, entry);
        if (fs.existsSync(absoluteDir)) {
          app.use(serveStatic(absoluteDir));
        }
      } else if (entry && typeof entry === 'object') {
        const route = entry.route
          ? (entry.route.startsWith('/') ? entry.route : `/${entry.route}`)
          : '';
        const dirs = Array.isArray(entry.dir) ? entry.dir : [entry.dir];
        for (const dir of dirs) {
          const absoluteDir = path.isAbsolute(dir)
            ? dir
            : path.join(config.workspace, dir);
          if (fs.existsSync(absoluteDir)) {
            if (route) {
              app.use(route, serveStatic(absoluteDir));
            } else {
              app.use(serveStatic(absoluteDir));
            }
          }
        }
      }
    }
  }

  app.use(serveStatic(config.dest.base));
  app.use(serveStatic(config.src.base));
  app.use(serveStatic(config.workspace));

  return app;
}

export class ServerTask extends BaseTask {
  private watcher: FileWatcher | null = null;
  private wsServer: WebSocketServer | null = null;
  private clients = new Set<WebSocket>();

  constructor() {
    super({ name: 'serve', description: 'Start development server with live reload' });
  }

  broadcast(data: { type: 'reload' | 'reload-css'; file?: string }): void {
    const payload = JSON.stringify(data);
    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }

  async run(config: BalmConfig): Promise<void> {
    if (config.env.isProd) {
      logger.warn('server', 'Development server is disabled in production mode');
      return;
    }

    const app = createDevServerApp(config);
    const port = config.server.port || 3000;
    const host = config.server.host || 'localhost';

    const server = http.createServer(app);

    // WebSocket Live Reload Server
    this.wsServer = new WebSocketServer({ server, path: '/__balm_ws' });
    this.wsServer.on('connection', (socket) => {
      this.clients.add(socket);
      socket.on('close', () => this.clients.delete(socket));
    });

    // Start File Watcher
    this.watcher = new FileWatcher(config, (data) => {
      this.broadcast(data);
    });
    this.watcher.start();

    return new Promise((resolve) => {
      server.listen(port, host, () => {
        console.log('');
        logger.success('server', pc.bold('BalmJS Dev Server is ready!'));
        console.log(`  ${pc.green('➜')}  ${pc.bold('Local:')}   ${pc.cyan(`http://${host}:${port}/`)}`);
        console.log(`  ${pc.green('➜')}  ${pc.bold('Network:')} ${pc.cyan(`http://127.0.0.1:${port}/`)}`);
        console.log('');

        if (config.env.isTest) {
          this.watcher?.stop();
          this.wsServer?.close();
          server.close();
          resolve();
        }
      });
    });
  }
}
