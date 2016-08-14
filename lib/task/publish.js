class Publish extends Task {
  constructor() {
    super('publish');
  }
  get fn() {
    return (input = '', output = '', renameObj = {}) => {
      if (config.production) {
        input = input ? path.join(config.target.base, input) : this.input;
        output = output ? path.join(config.assets.root, output) : this.output;

        return gulp.src(input)
          .pipe($.rename(renameObj))
          .pipe(gulp.dest(output));
      }
    };
  }
}

export default Publish;
