import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
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

const DEV_STATIC_OPTIONS = {
  etag: false,
  lastModified: false,
  cacheControl: false
};

export interface DevServerAppOptions {
  ensureBuildReady?: () => void | Promise<void>;
}

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

export function createDevServerApp(
  config: BalmConfig,
  options: DevServerAppOptions = {}
): ReturnType<typeof connect> {
  const app = connect();

  // Disable browser HTTP caching in development so edits always serve fresh assets
  app.use((_req: any, res: any, next: any) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Self-heal dev output directory if externally deleted while dev server is running
  if (options.ensureBuildReady) {
    app.use((_req: any, _res: any, next: any) => {
      try {
        const result = options.ensureBuildReady!();
        if (result && typeof (result as Promise<void>).then === 'function') {
          (result as Promise<void>).then(() => next()).catch((err) => next(err));
        } else {
          next();
        }
      } catch (err) {
        next(err);
      }
    });
  }

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
    app.use('/' + config.paths.source.css, serveStatic(config.dest.css, DEV_STATIC_OPTIONS));
  }
  if (config.paths.tmp.css && config.paths.tmp.css !== config.paths.source.css) {
    app.use('/' + config.paths.tmp.css, serveStatic(config.dest.css, DEV_STATIC_OPTIONS));
  }

  if (config.paths.source.js) {
    app.use('/' + config.paths.source.js, serveStatic(config.dest.js, DEV_STATIC_OPTIONS));
  }
  if (config.paths.tmp.js && config.paths.tmp.js !== config.paths.source.js) {
    app.use('/' + config.paths.tmp.js, serveStatic(config.dest.js, DEV_STATIC_OPTIONS));
  }
  app.use('/chunk', serveStatic(path.join(config.dest.js, 'chunk'), DEV_STATIC_OPTIONS));
  app.use('/chunk', serveStatic(path.join(config.dest.base, 'chunk'), DEV_STATIC_OPTIONS));

  if (config.paths.source.img) {
    app.use(
      '/' + config.paths.source.img,
      serveStatic(path.join(config.src.base, config.paths.source.img), DEV_STATIC_OPTIONS)
    );
  }
  if (config.paths.tmp.img) {
    app.use('/' + config.paths.tmp.img, serveStatic(config.dest.img, DEV_STATIC_OPTIONS));
  }
  app.use('/img', serveStatic(path.join(config.dest.base, 'img'), DEV_STATIC_OPTIONS));
  app.use('/img', serveStatic(path.join(config.dest.js, 'img'), DEV_STATIC_OPTIONS));

  if (config.paths.source.font) {
    app.use(
      '/' + config.paths.source.font,
      serveStatic(path.join(config.src.base, config.paths.source.font), DEV_STATIC_OPTIONS)
    );
  }
  if (config.paths.tmp.font) {
    app.use('/' + config.paths.tmp.font, serveStatic(config.dest.font, DEV_STATIC_OPTIONS));
  }
  app.use('/font', serveStatic(path.join(config.dest.base, 'font'), DEV_STATIC_OPTIONS));
  app.use('/font', serveStatic(path.join(config.dest.js, 'font'), DEV_STATIC_OPTIONS));
  app.use('/fonts', serveStatic(path.join(config.src.base, 'fonts'), DEV_STATIC_OPTIONS));
  app.use('/fonts', serveStatic(path.join(config.dest.base, 'fonts'), DEV_STATIC_OPTIONS));

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
          app.use(serveStatic(absoluteDir, DEV_STATIC_OPTIONS));
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
              app.use(route, serveStatic(absoluteDir, DEV_STATIC_OPTIONS));
            } else {
              app.use(serveStatic(absoluteDir, DEV_STATIC_OPTIONS));
            }
          }
        }
      }
    }
  }

  app.use(serveStatic(config.dest.base, DEV_STATIC_OPTIONS));
  app.use(serveStatic(config.src.base, DEV_STATIC_OPTIONS));
  app.use(serveStatic(config.workspace, DEV_STATIC_OPTIONS));

  return app;
}

export function getNetworkAddresses(): string[] {
  const addresses: string[] = [];
  const interfaces = os.networkInterfaces();
  for (const entries of Object.values(interfaces)) {
    for (const net of entries || []) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push(net.address);
      }
    }
  }
  return addresses;
}

export function resolveServerHost(
  rawHost: string | boolean | null | undefined,
  envHost = process.env.HOST
): { host: string; isWildcard: boolean } {
  let host = 'localhost';

  if (rawHost === true) {
    host = '0.0.0.0';
  } else if (typeof rawHost === 'string' && rawHost.trim()) {
    host = rawHost.trim();
  } else if (rawHost !== false && typeof envHost === 'string' && envHost.trim()) {
    const trimmed = envHost.trim();
    host = trimmed === 'true' ? '0.0.0.0' : trimmed;
  }

  return {
    host,
    isWildcard: host === '0.0.0.0' || host === '::'
  };
}

export class ServerTask extends BaseTask {
  private watcher: FileWatcher | null = null;
  private wsServer: WebSocketServer | null = null;
  private clients = new Set<WebSocket>();
  private serverId = crypto.randomUUID();
  private buildVersion = 1;
  private recoveryPromise: Promise<void> | null = null;

  constructor() {
    super({ name: 'serve', description: 'Start development server with live reload' });
  }

  private getHandshakePayload(): string {
    return JSON.stringify({
      type: 'connected',
      serverId: this.serverId,
      buildVersion: this.buildVersion
    });
  }

  broadcast(data: { type: 'reload' | 'reload-css'; file?: string }): void {
    this.buildVersion += 1;
    const payload = JSON.stringify({
      ...data,
      serverId: this.serverId,
      buildVersion: this.buildVersion
    });
    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }

  private ensureBuildReady(config: BalmConfig): void | Promise<void> {
    if (fs.existsSync(config.dest.base)) {
      return;
    }

    if (!this.watcher) {
      return;
    }

    if (this.recoveryPromise) {
      return this.recoveryPromise;
    }

    logger.warn(
      'server',
      `Dev output directory (${config.dest.base}) missing — rebuilding workspace...`
    );

    const activeRecovery = this.watcher
      .rebuildAll()
      .then(() => {
        this.buildVersion += 1;
      })
      .finally(() => {
        if (this.recoveryPromise === activeRecovery) {
          this.recoveryPromise = null;
        }
      });

    this.recoveryPromise = activeRecovery;
    return activeRecovery;
  }

  attachLiveReloadServer(server: http.Server): WebSocketServer {
    const wsServer = new WebSocketServer({ server, path: '/__balm_ws' });
    wsServer.on('connection', (socket) => {
      this.clients.add(socket);
      socket.send(this.getHandshakePayload());
      socket.on('message', (raw) => {
        try {
          const msg = JSON.parse(raw.toString());
          if (msg?.type === 'sync' && socket.readyState === WebSocket.OPEN) {
            socket.send(this.getHandshakePayload());
          }
        } catch {
          // ignore malformed client frames
        }
      });
      socket.on('close', () => this.clients.delete(socket));
    });
    this.wsServer = wsServer;
    return wsServer;
  }

  async run(config: BalmConfig): Promise<void> {
    if (config.env.isProd) {
      logger.warn('server', 'Development server is disabled in production mode');
      return;
    }

    // Start File Watcher before server so recovery requests can delegate to it
    this.watcher = new FileWatcher(config, (data) => {
      this.broadcast(data);
    });
    this.watcher.start();

    const app = createDevServerApp(config, {
      ensureBuildReady: () => this.ensureBuildReady(config)
    });
    const port = config.server.port ?? 3000;
    const { host, isWildcard } = resolveServerHost(config.server.host);

    const server = http.createServer(app);

    // WebSocket Live Reload Server with serverId + buildVersion handshake
    this.attachLiveReloadServer(server);

    return new Promise((resolve) => {
      server.listen(port, host, () => {
        const address = server.address();
        const activePort =
          address && typeof address === 'object' ? address.port : port;
        const localHost = isWildcard ? 'localhost' : host;

        console.log('');
        logger.success('server', pc.bold('BalmJS Dev Server is ready!'));
        console.log(
          `  ${pc.green('➜')}  ${pc.bold('Local:')}   ${pc.cyan(`http://${localHost}:${activePort}/`)}`
        );

        if (isWildcard) {
          const networkIps = getNetworkAddresses();
          if (networkIps.length > 0) {
            for (const ip of networkIps) {
              console.log(
                `  ${pc.green('➜')}  ${pc.bold('Network:')} ${pc.cyan(`http://${ip}:${activePort}/`)}`
              );
            }
          } else {
            console.log(
              `  ${pc.green('➜')}  ${pc.bold('Network:')} ${pc.cyan(`http://127.0.0.1:${activePort}/`)}`
            );
          }
        } else if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
          console.log(
            `  ${pc.dim('➜  Network: use --host or server.host = true to expose')}`
          );
        }
        console.log('');

        if (config.env.isTest) {
          this.watcher?.stop();
          this.wsServer?.close();
          server.close();
          resolve();
        } else {
          const cleanup = () => {
            this.watcher?.stop();
            this.wsServer?.close();
            server.close();
          };
          process.once('SIGINT', () => {
            cleanup();
            process.exit(0);
          });
          process.once('SIGTERM', () => {
            cleanup();
            process.exit(0);
          });
        }
      });
    });
  }
}
