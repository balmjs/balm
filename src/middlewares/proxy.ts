import proxy from 'http-proxy-middleware';

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
      if (proxyConfig.context && proxyConfig.options) {
        middleware.push(proxy(proxyConfig.context, proxyConfig.options));
      } else {
        _handleProxyConfigError();
      }
    } else if (BalmJS.utils.isArray(proxyConfig)) {
      // Multiple proxies
      for (const config of proxyConfig) {
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
