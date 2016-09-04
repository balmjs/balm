import webpackConfig from '../webpack.config';

class Js extends BalmJS.Task {
  constructor() {
    super('js');
  }
  get fn() {
    return (input = '', output = config.tmp.js) => {
      webpack(webpackConfig(input, output), (err, stats) => {
        if (err) {
          throw new $.util.PluginError('webpack', err);
        }
        $.util.log('[webpack]', stats.toString(config.scripts.stats));
      });
    };
  }
}

export default Js;
