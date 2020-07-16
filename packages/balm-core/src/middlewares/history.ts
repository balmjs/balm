import history from 'connect-history-api-fallback';

function historyMiddleware(): object[] {
  const historyOptions = BalmJS.config.server.historyOptions;

  if (historyOptions && !BalmJS.config.assets.publicUrl) {
    BalmJS.config.assets.publicUrl = '/';
  }

  return historyOptions
    ? [
        BalmJS.utils.isObject(historyOptions)
          ? history(historyOptions)
          : history()
      ]
    : [];
}

export default historyMiddleware;
