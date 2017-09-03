import postcssPlugins from '../plugin/postcss';

class Css extends BalmJS.Task {
  constructor() {
    super('css');

    this.input = path.join(config.roots.source, config.paths.source.css, '**', '!(_*).css');
    this.output = this.getStylePath();
  }
  get recipe() {
    return true;
  }
  get deps() {
    return this.getSpriteTasks();
  }
  get fn() {
    return (input = this.input, output = this.output) => {
      let stream = gulp.src(this.getAbsPaths(input))
        .pipe($.plumber())
        .pipe($.if(!config.production, $.sourcemaps.init()))
        .pipe($.postcss(postcssPlugins, config.styles.postcss.options));

      return this.handleStyle(stream, output);
    };
  }
}

export default Css;
