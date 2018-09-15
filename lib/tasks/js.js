import { webpackConfig, webpackErrorHandling } from '../bundler/webpack.config';

class Js extends Task {
  constructor(entry = '', output = '', uglifyOptions = false) {
    super('js');

    let defaultOutput = config.production
      ? path.join(
          config.roots.target,
          config.assets.subDir,
          config.paths.target.js
        )
      : path.join(config.roots.tmp, config.paths.tmp.js);

    this.input = entry;
    this.output = output || defaultOutput;
    this.uglifyOptions = uglifyOptions;
  }

  get fn() {
    return callback => {
      webpack(
        webpackConfig(this.input, this.output, this.uglifyOptions),
        (err, stats) => {
          webpackErrorHandling(err, stats);
          callback();
        }
      );
    };
  }
}

export default Js;
