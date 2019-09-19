import webpackDev from 'webpack-dev-middleware';
import webpackHot from 'webpack-hot-middleware';

function webpackMiddleware(): object[] {
  const middleware: object[] = [];

  if (BalmJS.webpackCompiler) {
    middleware.push(
      webpackDev(
        BalmJS.webpackCompiler,
        Object.assign(
          {
            publicPath: BalmJS.file.getPublicPath()
          },
          BalmJS.config.server.devOptions
        )
      )
    );

    if (BalmJS.config.scripts.hot) {
      middleware.push(
        webpackHot(BalmJS.webpackCompiler, {
          log: false,
          path: BalmJS.config.server.hotOptions.path || '/__webpack_hmr'
        })
      );
    }
  } else {
    BalmJS.logger.warn('<webpack middleware>', 'webpack compiler is not ready');
  }

  return middleware;
}

export default webpackMiddleware;
