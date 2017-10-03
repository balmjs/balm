import webpackConfig from '../webpack.config';

class Js extends Task {
  constructor(input = '', output = '') {
    super('js');

    this.input = input;
    this.output = output || path.join(config.roots.tmp, config.paths.tmp.js);
  }
  get fn() {
    return () => {
      webpack(webpackConfig(this.input, this.output), (err, stats) => {
        if (err) {
          throw new $.util.PluginError('webpack', err);
        }
        $.util.log('[Js]', stats.toString(config.scripts.stats));
      });
    };
  }
}

export default Js;
