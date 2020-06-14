import { createProxyMiddleware } from 'http-proxy-middleware';
import { ProxyConfig } from '@balm/index';

function _handleProxyConfigError(): void {
  const configuration = '{ context: string | array, options: object }';

  BalmJS.logger.error(
    'proxy middleware',
    `Proxy config must be an object (${configuration}) or array ([${configuration}])`
  );
}

function httpProxyMiddleware(): object[] {
  const middleware: object[] = [];
  const proxyConfig = BalmJS.config.server.proxyConfig;

  if (proxyConfig) {
    try {
      if (BalmJS.utils.isObject(proxyConfig)) {
        // Single proxy
        const config = proxyConfig as ProxyConfig;
        if (config.context && config.options) {
          middleware.push(
            createProxyMiddleware(config.context, config.options)
          );
        } else {
          _handleProxyConfigError();
        }
      } else if (BalmJS.utils.isArray(proxyConfig)) {
        // Multiple proxies
        for (const config of proxyConfig as ProxyConfig[]) {
          if (config.context && config.options) {
            middleware.push(
              createProxyMiddleware(config.context, config.options)
            );
          } else {
            _handleProxyConfigError();
          }
        }
      } else {
        _handleProxyConfigError();
      }
    } catch (error) {
      BalmJS.logger.error('proxy middleware', error.message);
    }
  }

  return middleware;
}

export default httpProxyMiddleware;
