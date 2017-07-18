class Publish extends BalmJS.Task {
  constructor() {
    super('publish'); // Just for production
  }
  get recipe() {
    return true;
  }
  get fn() {
    return (input = '', output = '', renameObj = {}) => {
      input = input
        ? path.join(config.target.base, input)
        : [`${config.target.static}/**/*`, `!${config.target.base}/*.*`];
      output = output
        ? path.join(config.assets.root, output)
        : config.assets.static;

      return gulp.src(input)
        .pipe($.rename(renameObj))
        .pipe(gulp.dest(output));
    };
  }
}

export default Publish;
