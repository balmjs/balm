import proxy from 'http-proxy-middleware';

if (config.server.proxyTable) {
  logger.warn(
    '[Server]',
    '`server.proxyTable` was removed in balm@0.18.0. Use `server.proxyContext`, `server.proxyOptions` instead. (See https://balmjs.com/docs/en/configuration/server.html)'
  );
}

const getProxyMiddleware = () => {
  let middleware = [];

  // Single proxy
  if (config.server.proxyOptions) {
    if (config.server.proxyContext) {
      middleware.push(
        proxy(config.server.proxyContext, config.server.proxyOptions)
      );
    } else {
      middleware.push(proxy(config.server.proxyOptions));
    }
  }

  // Multiple proxies
  if (config.server.httpProxy) {
    config.server.httpProxy.forEach(proxyConfig => {
      middleware.push(proxy(proxyConfig.context, proxyConfig.options));
    });
  }

  return middleware;
};

export default getProxyMiddleware;
