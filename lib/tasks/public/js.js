import {
  webpackConfig,
  webpackErrorHandling
} from '../../bundler/webpack.config';

class JsTask extends BalmTask {
  constructor(entry = '', output = '') {
    super('js');

    let defaultOutput = config.isProd
      ? path.join(
          config.roots.target,
          config.assets.subDir,
          config.assets.buildDir,
          config.paths.target.js
        )
      : path.join(config.roots.tmp, config.paths.tmp.js);

    this.input = entry;
    this.output = output || defaultOutput;
  }

  get fn() {
    return cb => {
      webpack(webpackConfig(this.input, this.output), (err, stats) => {
        webpackErrorHandling(err, stats);
        cb();
      });
    };
  }
}

export default JsTask;
