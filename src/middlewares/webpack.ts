import webpackDev from 'webpack-dev-middleware';
import webpackHot from 'webpack-hot-middleware';
import { HMR_PATH } from '../config/constants';

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
          path: HMR_PATH
        })
      );
    }
  } else {
    BalmJS.logger.warn(
      'webpack middleware',
      'Webpack compiler is not ready, `HMR` is disabled'
    );
    BalmJS.config.scripts.hot = false;
  }

  return middleware;
}

export default webpackMiddleware;
