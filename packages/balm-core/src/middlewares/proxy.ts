import { createProxyMiddleware } from 'http-proxy-middleware';
import { BalmError, BalmProxyOptions } from '@balm-core/index';

function httpProxyMiddleware(): object[] {
  const middleware: object[] = [];
  const proxyOptions = BalmJS.config.server.proxyOptions;

  if (proxyOptions) {
    try {
      if (BalmJS.utils.isObject(proxyOptions)) {
        // Single proxy
        const options = proxyOptions as BalmProxyOptions;
        middleware.push(createProxyMiddleware(options));
      } else if (BalmJS.utils.isArray(proxyOptions)) {
        // Multiple proxies
        for (const options of proxyOptions as BalmProxyOptions[]) {
          middleware.push(createProxyMiddleware(options));
        }
      } else {
        BalmJS.logger.error(
          'proxy middleware',
          `Proxy options (https://github.com/chimurai/http-proxy-middleware#options) must be an object or array`
        );
      }
    } catch (error) {
      const { message } = error as BalmError;
      BalmJS.logger.error('proxy middleware', message);
    }
  }

  return middleware;
}

export default httpProxyMiddleware;
