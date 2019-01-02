import { webpackConfig, webpackErrorHandling } from '../bundler/webpack.config';

class Script extends BalmTask {
  constructor() {
    super('scripts');
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

export default Script;
