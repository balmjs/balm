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
    return Object.assign(
      {
        paths: BalmFile.stylePaths()
      },
      config.styles.lessOptions
    );
  }

  get fn() {
    return () => {
      let stream = src(BalmFile.absPaths(this.input))
        .pipe($.plumber(this.errorHandler))
        .pipe($.if(config.isDev, $.sourcemaps.init()))
        .pipe($.less(this.options));

      return this.handleStyle(stream, this.output);
    };
  }
}

export default LessTask;
