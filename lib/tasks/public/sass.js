import BalmStyleTask from '../style';

class SassTask extends BalmStyleTask {
  constructor(input = '', output = '') {
    super('sass');

    this.input =
      input ||
      path.join(
        config.roots.source,
        config.paths.source.css,
        '**',
        '!(_*).scss'
      );
    this.output = output || this.stylePath;
  }

  get options() {
    return Object.assign(
      {
        outputStyle: 'expanded',
        precision: 10,
        includePaths: BalmFile.stylePaths()
      },
      config.styles.sassOptions
    );
  }

  get fn() {
    return () => {
      let stream = src(BalmFile.absPaths(this.input))
        .pipe($.plumber(this.errorHandler))
        .pipe($.if(config.isDev, $.sourcemaps.init()))
        .pipe($.sass.sync(this.options));

      return this.handleStyle(stream, this.output);
    };
  }
}

export default SassTask;
