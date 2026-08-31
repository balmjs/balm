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

    const app = connect();
    const port = config.server.port || 3000;
    const host = config.server.host || 'localhost';

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

    app.use(serveStatic(config.dest.base));
    app.use(serveStatic(config.src.base));
    app.use(serveStatic(config.workspace));

    // History API fallback for SPA
    if (config.server.historyOptions) {
      app.use((req: any, res: any, next: any) => {
        const isGetOrHead = req.method === 'GET' || req.method === 'HEAD';
        const isHtmlNav = !req.url?.includes('.') || req.headers.accept?.includes('text/html');
        if (isGetOrHead && isHtmlNav) {
          const indexPath = path.join(config.dest.html, 'index.html');
          const srcIndexPath = path.join(config.src.base, 'index.html');
          const fileToServe = fs.existsSync(indexPath) ? indexPath : srcIndexPath;
          if (fs.existsSync(fileToServe)) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            if (req.method === 'HEAD') {
              return res.end();
            }
            return fs.createReadStream(fileToServe).pipe(res);
          }
        }
        next();
      });
    }

    // Proxy middleware
    if (config.server.proxy && typeof config.server.proxy === 'object') {
      const proxyEntries = Array.isArray(config.server.proxy)
        ? config.server.proxy
        : [config.server.proxy];

      for (const entry of proxyEntries) {
        if (entry.context && entry.options) {
          app.use(createProxyMiddleware(entry.options));
        }
      }
    }

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
