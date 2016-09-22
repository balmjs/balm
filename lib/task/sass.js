class Sass extends BalmJS.Task {
  constructor() {
    super('sass');

    this.input = path.join(config.roots.source, config.paths.source.css, '**', '*.scss');
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
        .pipe($.sass.sync({
          outputStyle: 'expanded',
          precision: 10,
          includePaths: [path.join(config.workspace, '.')]
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({
          browsers: config.styles.autoprefixer
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(this.getAbsPaths(output)))
        .pipe(reload({
          stream: true
        }));
    };
  }
}

export default Sass;
