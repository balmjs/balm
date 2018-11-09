import getPostcssPlugins from '../plugins/postcss';

class Sass extends BalmTask {
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
    this.output = output || this.getStylePath();
  }

  getOptions() {
    return {
      outputStyle: 'expanded',
      precision: 10,
      includePaths: BalmFile.stylePaths()
    };
  }

  get task() {
    return () => {
      let stream = src(BalmFile.absPaths(this.input))
        .pipe($.plumber())
        .pipe($.if(!config.production, $.sourcemaps.init()))
        .pipe($.sass.sync(this.getOptions()).on('error', $.sass.logError))
        .pipe($.postcss(getPostcssPlugins(), config.styles.postcssOptions));

      return this.handleStyle(stream, this.output);
    };
  }
}

export default Sass;
