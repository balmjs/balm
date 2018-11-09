import { webpackConfig, webpackErrorHandling } from '../bundler/webpack.config';

class Webpack extends BalmTask {
  constructor() {
    super('webpack');
  }

  get task() {
    return config.scripts.entry
      ? callback => {
          webpack(webpackConfig(), (err, stats) => {
            webpackErrorHandling(err, stats);
            callback();
          });
        }
      : logger.warn('[JS entry]', 'JS entry must be an object');
  }
}

export default Webpack;
