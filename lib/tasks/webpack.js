import { webpackConfig, webpackErrorHandling } from '../bundler/webpack.config';

class Webpack extends BalmTask {
  constructor() {
    super('webpack');
  }

  get fn() {
    return config.scripts.entry
      ? cb => {
          webpack(webpackConfig(), (err, stats) => {
            webpackErrorHandling(err, stats);
            cb();
          });
        }
      : logger.warn('[JS entry]', 'JS entry must be an object');
  }
}

export default Webpack;
