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

  if (BalmJS.config.logs.level <= BalmJS.LogLevel.Debug) {
    BalmJS.logger.info('middlewares', middlewares);
  }

  return middlewares;
}

export default getMiddlewares;
