import webpack from 'webpack';
import webpackConfig from '../webpack.config';

class Script {
  get name() {
    return 'scripts';
  }
  get deps() {
    return [];
  }
  get fn() {
    return callback => {
      webpack(webpackConfig(), (err, stats) => {
        if (err) {
          throw new $.util.PluginError('webpack', err);
        }
        $.util.log('[webpack]', stats.toString({
          colors: true
        }));
        callback();
      });
    };
  }
}

export default Script;
