import {postcssProcessor} from '../helper';

class Css extends BalmJS.Task {
  constructor() {
    super('css');

    this.input = path.join(config.roots.source, config.paths.source.css, '**', '!(_*).css');
    this.output = path.join(config.roots.tmp, config.paths.tmp.css);
  }
  get recipe() {
    return true;
  }
  get deps() {
    return this.getSpriteTasks();
  }
  get fn() {
    return (input = this.input, output = this.output) => {
      return gulp.src(this.getAbsPaths(input))
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.postcss(postcssProcessor(), {parser: require('postcss-scss')}))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(this.getAbsPaths(output)))
        .pipe(reload({match: '**/*.css'}));
    };
  }
}

export default Css;
