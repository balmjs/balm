import {
  webpackConfig,
  webpackErrorHandling
} from '../../bundler/webpack.config';

class Script extends BalmTask {
  constructor() {
    super('scripts');
  }

  get fn() {
    return cb => {
      if (config.scripts.entry) {
        webpack(webpackConfig(), (err, stats) => {
          webpackErrorHandling(err, stats);
          cb();
        });
      } else {
        logger.warn('[JS entry]', 'JS entry must be an object');
        cb();
      }
    };
  }
}

export default Script;
