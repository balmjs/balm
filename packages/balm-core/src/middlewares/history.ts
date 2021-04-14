function historyMiddleware(): object[] {
  const history = require('connect-history-api-fallback');

  const historyOptions = BalmJS.config.server.historyOptions;

  return historyOptions
    ? [
        BalmJS.utils.isObject(historyOptions)
          ? history(historyOptions)
          : history()
      ]
    : [];
}

export default historyMiddleware;
