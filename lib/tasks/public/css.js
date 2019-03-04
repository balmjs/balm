import BalmStyleTask from '../style';

class CssTask extends BalmStyleTask {
  constructor(input = '', output = '') {
    super('css');

    this.input =
      input ||
      path.join(
        config.roots.source,
        config.paths.source.css,
        '**',
        '!(_*).css'
      );
    this.output = output || this.stylePath;
  }

  get fn() {
    return () => {
      let stream = src(BalmFile.absPaths(this.input))
        .pipe($.plumber(this.errorHandler))
        .pipe($.if(config.isDev, $.sourcemaps.init()));

      return this.handleStyle(stream, this.output);
    };
  }
}

export default CssTask;
