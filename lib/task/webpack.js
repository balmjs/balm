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
    return (callback) => {
      webpack(webpackConfig(), (err, stats) => {
        if (err) {
          throw new $.util.PluginError('webpack', err);
        }
        $.util.log('[webpack]', stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }));
        callback();
      });
    };
  }
}

export default Webpack;
