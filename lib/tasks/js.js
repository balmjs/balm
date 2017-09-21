import webpackConfig from '../webpack.config';

class Js extends BalmJS.Task {
  constructor() {
    super('js');

    this.output = path.join(config.roots.tmp, config.paths.tmp.js);
  }
  get recipe() {
    return true;
  }
  get fn() {
    return (input = '', output = this.output) => {
      webpack(webpackConfig(input, output), (err, stats) => {
        if (err) {
          throw new $.util.PluginError('webpack', err);
        }
        $.util.log('[Js]', stats.toString(config.scripts.stats));
      });
    };
  }
}

export default Js;
