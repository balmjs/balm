import webpackMiddleware from './webpack';
import httpProxyMiddleware from './proxy';
import historyMiddleware from './history';

function getMiddlewares(): object[] {
  return [
    ...webpackMiddleware(),
    ...httpProxyMiddleware(),
    ...historyMiddleware(),
    ...BalmJS.config.server.middlewares
  ];
}

export default getMiddlewares;
