import { createProxyMiddleware } from 'http-proxy-middleware';
import { BalmProxyConfig } from '@balm-core/index';

function handleProxyConfigError(): void {
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
        const config = proxyConfig as BalmProxyConfig;
        if (config.context && config.options) {
          middleware.push(
            createProxyMiddleware(config.context, config.options)
          );
        } else {
          handleProxyConfigError();
        }
      } else if (BalmJS.utils.isArray(proxyConfig)) {
        // Multiple proxies
        for (const config of proxyConfig as BalmProxyConfig[]) {
          if (config.context && config.options) {
            middleware.push(
              createProxyMiddleware(config.context, config.options)
            );
          } else {
            handleProxyConfigError();
          }
        }
      } else {
        handleProxyConfigError();
      }
    } catch (error) {
      BalmJS.logger.error('proxy middleware', error.message);
    }
  }

  return middleware;
}

export default httpProxyMiddleware;
