import BalmStyleTask from '../style';

class LessTask extends BalmStyleTask {
  constructor(input = '', output = '') {
    super('less');

    this.input =
      input ||
      path.join(
        config.roots.source,
        config.paths.source.css,
        '**',
        '!(_*).less'
      );
    this.output = output || this.stylePath;
  }

  get options() {
    return {
      paths: BalmFile.stylePaths()
    };
  }

  get fn() {
    return () => {
      let stream = src(BalmFile.absPaths(this.input))
        .pipe($.plumber(this.errorHandler))
        .pipe($.if(!config.isProd, $.sourcemaps.init()))
        .pipe($.less(this.options));

      return this.handleStyle(stream, this.output);
    };
  }
}

export default LessTask;
