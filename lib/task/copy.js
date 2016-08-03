class Copy extends Task {
  constructor() {
    super('copy');
  }
  get fn() {
    return (input = '', output = '', renameObj = {}) => {
      if (input && output) {
        let stream = gulp.src(input);

        if (Object.keys(renameObj).length) {
          stream = stream.pipe($.rename(renameObj));
        }

        return stream.pipe(gulp.dest(output));
      }
    };
  }
}

export default Copy;
