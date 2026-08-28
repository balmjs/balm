import http from 'node:http';
import connect from 'connect';
import serveStatic from 'serve-static';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { BaseTask } from '../runner/task.js';
import { BalmConfig } from '../types/index.js';
import { logger } from '../utilities/logger.js';
import pc from 'picocolors';

export class ServerTask extends BaseTask {
  constructor() {
    super({ name: 'serve', description: 'Start development server' });
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
    return new Promise((resolve) => {
      server.listen(port, host, () => {
        logger.success('server', `Server running at ${pc.cyan(`http://${host}:${port}`)}`);
        resolve();
      });
    });
  }
}
