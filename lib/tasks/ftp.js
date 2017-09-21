class Ftp extends BalmJS.Task {
  constructor() {
    super('ftp');
  }
  get recipe() {
    return true;
  }
  get fn() {
    return (input = '') => {
      return gulp.src(this.getAbsPaths(input))
        .pipe($.sftp(config.ftp));
    };
  }
}

export default Ftp;
