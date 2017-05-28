import getProcessors from '../plugin/postcss';

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
        .pipe($.sourcemaps.init())
        .pipe($.postcss(getProcessors(), {parser: require('postcss-scss')}));

      return this.handleStyle(stream, output);
    };
  }
}

export default Css;
