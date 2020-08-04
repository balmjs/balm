import history from 'connect-history-api-fallback';

function historyMiddleware(): object[] {
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
