import webpack from 'webpack';
import webpackConfig from '../webpack.config';

class Js extends Task {
  constructor() {
    super('js');
  }
  get fn() {
    return (input = '', output = this.output) => {
      if (input) {
        webpack(webpackConfig(input, output), (err, stats) => {
          if (err) {
            throw new $.util.PluginError('webpack', err);
          }
          $.util.log('[webpack]', stats.toString(config.scripts.stats));
        });
      }
    };
  }
}

export default Js;
