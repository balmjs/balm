import http from 'node:http';
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

    // Static assets
    app.use(serveStatic(config.dest.base));
    app.use(serveStatic(config.src.base));

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
