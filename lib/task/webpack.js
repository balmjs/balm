import webpack from 'webpack';
import webpackConfig from '../webpack.config';

class Webpack {
  get name() {
    return 'webpack';
  }
  get deps() {
    return [];
  }
  get fn() {
    return () => {
      webpack(webpackConfig(), (err, stats) => {
        if (err) {
          throw new $.util.PluginError('webpack', err);
        }
        $.util.log('[webpack]', stats.toString({
          colors: true
        }));
      });
    };
  }
}

export default Webpack;
