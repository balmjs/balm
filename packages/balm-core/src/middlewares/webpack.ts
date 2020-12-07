import webpackDev from 'webpack-dev-middleware';
import webpackHot from 'webpack-hot-middleware';
import { HMR_PATH } from '../config/constants';

function webpackMiddleware(): object[] {
  const middleware: object[] = [];

  if (BalmJS.webpackCompiler) {
    middleware.push(
      webpackDev(
        BalmJS.webpackCompiler,
        Object.assign({}, BalmJS.config.server.devOptions, {
          publicPath: BalmJS.file.publicUrlOrPath
        })
      )
    );

    if (BalmJS.config.server.useHMR) {
      middleware.push(
        webpackHot(BalmJS.webpackCompiler, {
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
