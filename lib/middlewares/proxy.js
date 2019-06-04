import proxy from 'http-proxy-middleware';

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
  const proxyConfigCount = config.server.proxyConfig.length;
  if (proxyConfigCount) {
    for (let i = 0; i < proxyConfigCount; i++) {
      let proxyConfig = config.server.proxyConfig[i];

      if (proxyConfig.context && proxyConfig.options) {
        middleware.push(proxy(proxyConfig.context, proxyConfig.options));
      } else {
        logger.warn(
          '[Proxy]',
          'Proxy config `{context: string|array, options: object}`.'
        );
      }
    }
  }

  return middleware;
};

export default getProxyMiddleware;
