import getPostcssPlugins from '../plugins/postcss';

class Css extends Task {
  constructor(input = '', output = '') {
    super('css');

    this.customCompile = input;
    this.input =
      input ||
      path.join(
        config.roots.source,
        config.paths.source.css,
        '**',
        '!(_*).css'
      );
    this.output = output || this.getStylePath();
  }

  get fn() {
    return () => {
      let stream = gulp
        .src(File.absPaths(this.input))
        .pipe($.plumber())
        .pipe($.if(!config.production, $.sourcemaps.init()))
        .pipe($.postcss(getPostcssPlugins(), config.styles.postcssOptions));

      return this.handleStyle(stream, this.output, this.customCompile);
    };
  }
}

export default Css;
