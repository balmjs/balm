import {stylePaths} from '../helpers/index';
import postcssPlugins from '../plugins/postcss';

class Sass extends Task {
  constructor(input = '', output = '') {
    super('sass');

    this.input = input || path.join(config.roots.source, config.paths.source.css, '**', '*.scss');
    this.output = output || this.getStylePath();
  }
  getOptions() {
    return {
      outputStyle: 'expanded',
      precision: 10,
      includePaths: stylePaths()
    };
  }
  get deps() {
    return this.getSpriteTasks();
  }
  get fn() {
    return () => {
      let stream = gulp.src(this.getAbsPaths(this.input))
        .pipe($.plumber())
        .pipe($.if(!config.production, $.sourcemaps.init()))
        .pipe($.sass.sync(this.getOptions()).on('error', $.sass.logError))
        .pipe($.postcss(postcssPlugins, config.styles.postcss.options));

      return this.handleStyle(stream, this.output);
    };
  }
}

export default Sass;
