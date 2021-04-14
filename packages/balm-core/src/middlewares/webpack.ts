import { HMR_PATH } from '../config/constants';

function webpackMiddleware(): object[] {
  const middleware: object[] = [];

  if (BalmJS.webpackCompiler) {
    middleware.push(
      require('webpack-dev-middleware')(
        BalmJS.webpackCompiler,
        Object.assign({}, BalmJS.config.server.devOptions, {
          publicPath: BalmJS.file.publicUrlOrPath,
          stats: false
        })
      )
    );

    if (BalmJS.config.server.useHMR) {
      middleware.push(
        require('webpack-hot-middleware')(BalmJS.webpackCompiler, {
          log: false,
          path: HMR_PATH
        })
      );
    }
  } else {
    BalmJS.logger.warn('webpack middleware', 'Webpack compiler is not ready');
  }

  return middleware;
}

export default webpackMiddleware;
