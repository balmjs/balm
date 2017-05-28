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
      includePaths: [path.join(config.workspace, '.')].concat(config.styles.includePaths)
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
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync(this.getOptions()).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: config.styles.autoprefixer}));

      return this.handleStyle(stream, output);
    };
  }
}

export default Sass;
