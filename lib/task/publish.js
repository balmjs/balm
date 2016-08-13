class Publish extends Task {
  constructor() {
    super('publish');
  }
  get fn() {
    return (input = '', output = '', renameObj = {}) => {
      if (config.production && output) {
        this.src = input ? path.join(config.assets.root, config.assets.publicPath, input) : this.input;

        return gulp.src(this.src)
          .pipe($.rename(renameObj))
          .pipe(gulp.dest(output));
      }
    };
  }
}

export default Publish;
