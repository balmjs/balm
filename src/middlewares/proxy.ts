import proxy from 'http-proxy-middleware';
import { ProxyConfig } from '../config/types';

function _handleProxyConfigError(): void {
  BalmJS.logger.error(
    'proxy middleware',
    'Proxy config must be an object (`{ context: string | array, options: object }`) or array'
  );
}

function httpProxyMiddleware(): object[] {
  const middleware: object[] = [];
  const proxyConfig = BalmJS.config.server.proxyConfig;

  if (proxyConfig) {
    if (BalmJS.utils.isObject(proxyConfig)) {
      // Single proxy
      const config = proxyConfig as ProxyConfig;
      if (config.context && config.options) {
        middleware.push(proxy(config.context, config.options));
      } else {
        _handleProxyConfigError();
      }
    } else if (BalmJS.utils.isArray(proxyConfig)) {
      // Multiple proxies
      for (const config of proxyConfig as ProxyConfig[]) {
        if (config.context && config.options) {
          middleware.push(proxy(config.context, config.options));
        } else {
          _handleProxyConfigError();
        }
      }
    } else {
      _handleProxyConfigError();
    }
  }

  return middleware;
}

export default httpProxyMiddleware;
