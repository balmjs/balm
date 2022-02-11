import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { HMR_PATH } from '../config/constants.js';

function webpackMiddleware(): object[] {
  const middleware: object[] = [];

  if (BalmJS.webpackCompiler) {
    middleware.push(
      webpackDevMiddleware(
        BalmJS.webpackCompiler,
        Object.assign({}, BalmJS.config.server.devOptions, {
          headers: [
            {
              key: 'balm-core',
              value: BalmJS.version
            }
          ],
          publicPath: BalmJS.file.publicUrlOrPath,
          stats: false
        })
      )
    );

    if (BalmJS.config.server.useHMR) {
      middleware.push(
        webpackHotMiddleware(BalmJS.webpackCompiler, {
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
