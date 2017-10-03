class Ftp extends Task {
  constructor(input = '') {
    super('ftp');

    this.input = input;
  }
  get fn() {
    return () => {
      return gulp.src(this.getAbsPaths(this.input))
        .pipe($.sftp(config.ftp));
    };
  }
}

export default Ftp;
