import webpackConfig from '../webpack.config';

class Webpack extends BalmJS.Task {
  constructor() {
    super('webpack');
  }
  get deps() {
    let hasDll = Object.keys(config.scripts.dll).length;
    console.log('hasDll', hasDll);
    return hasDll ? ['dll'] : [];
  }
  get fn() {
    return callback => {
      webpack(webpackConfig(), (err, stats) => {
        if (err) {
          throw new $.util.PluginError('webpack', err);
        }
        $.util.log('[Webpack]', stats.toString(config.scripts.stats));
        callback();
      });
    };
  }
}

export default Webpack;
