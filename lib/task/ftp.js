class Ftp extends Task {
  constructor() {
    super('ftp');
  }
  get fn() {
    return (input = '') => {
      if (input) {
        return gulp.src(this.getAbsPaths(input))
          .pipe($.sftp(config.ftp));
      }
    };
  }
}

export default Ftp;
