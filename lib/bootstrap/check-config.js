const checkConfig = () => {
  if (config.server.proxyTable) {
    logger.warn(
      '[Balm Config - server]',
      '`server.proxyTable` was removed in balm@0.18.0. Use `server.proxyContext`, `server.proxyOptions` instead. (See https://balmjs.com/docs/en/configuration/server.html)'
    );
  }

  if (config.scripts.cdn) {
    logger.warn(
      '[Balm Config - scripts]',
      '`scripts.cdn` was removed in balm@0.20.0. Use `server.externals` instead. (See https://balmjs.com/docs/en/configuration/scripts.html)'
    );
  }

  if (config.assets.publicPath) {
    logger.warn(
      '[Balm Config - assets]',
      '`config.assets.publicPath` was removed in balm@1.0.0, use `config.assets.mainDir` instead. (See https://balmjs.com/docs/en/configuration/publish.html#assets)'
    );
  }

  if (config.styles.autoprefixer) {
    logger.warn(
      '[Balm Config - styles]',
      '`config.styles.autoprefixer` was removed in balm@1.5.1, use a `.browserslistrc` config file in current or parent directories instead. (See https://balmjs.com/docs/en/configuration/styles.html)'
    );
  }
};

export default checkConfig;
