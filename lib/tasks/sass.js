import {stylePaths} from '../helpers/index';
import postcssPlugins from '../plugins/postcss';

class Sass extends BalmJS.Task {
  constructor() {
    super('sass');

    this.input = path.join(config.roots.source, config.paths.source.css, '**', '*.scss');
    this.output = this.getStylePath();
  }
  getOptions() {
    return {
      outputStyle: 'expanded',
      precision: 10,
      includePaths: stylePaths()
    };
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
        .pipe($.sass.sync(this.getOptions()).on('error', $.sass.logError))
        .pipe($.postcss(postcssPlugins, config.styles.postcss.options));

      return this.handleStyle(stream, output);
    };
  }
}

export default Sass;
