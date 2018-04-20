import { webpackConfig, webpackErrorHandling } from '../bundler/webpack.config';

class Webpack extends Task {
  constructor() {
    super('webpack');
  }

  get fn() {
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
