import postcssPlugins from '../plugins/postcss';

class Css extends Task {
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
    this.output = output || this.getStylePath();
  }

  get fn() {
    return () => {
      let stream = gulp
        .src(File.absPaths(this.input))
        .pipe($.plumber())
        .pipe($.if(!config.production, $.sourcemaps.init()))
        .pipe($.postcss(postcssPlugins, config.styles.postcssOptions));

      return this.handleStyle(stream, this.output);
    };
  }
}

export default Css;
