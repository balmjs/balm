import webpackConfig from '../webpack.config';

class Webpack extends Task {
  constructor() {
    super('webpack');
  }
  get fn() {
    return config.scripts.entry
      ? callback => {
        webpack(webpackConfig(), (err, stats) => {
          if (err) {
            throw new $.util.PluginError('webpack', err);
          }
          $.util.log('[Webpack]', stats.toString(config.scripts.stats));
          callback();
        });
      }
      : BalmJS.noop;
  }
}

export default Webpack;
