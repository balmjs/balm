import webpackMiddleware from './webpack';
import httpProxyMiddleware from './proxy';
import history from 'connect-history-api-fallback';

function getMiddlewares(): object[] {
  const historyOptions = BalmJS.config.server.historyOptions;
  const middlewares: object[] = [
    ...webpackMiddleware(),
    ...httpProxyMiddleware(),
    ...(historyOptions
      ? [
          BalmJS.utils.isObject(historyOptions)
            ? history(historyOptions)
            : history()
        ]
      : []),
    ...BalmJS.config.server.middlewares
  ];

  return middlewares;
}

export default getMiddlewares;
