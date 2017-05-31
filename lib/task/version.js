class Version extends BalmJS.Task {
  constructor() {
    super('version');
  }
  get recipe() {
    return true;
  }
  get fn() {
    return (input = '', output = '', options = {}) => {
      console.log(this.getAbsPaths(input));
      return gulp.src(this.getAbsPaths(input))
        .pipe($.revAll.revision(Object.assign(config.assets.options, options)))
        .pipe(gulp.dest(this.getAbsPaths(output)))
        .pipe($.revAll.manifestFile())
        .pipe(gulp.dest(this.getAbsPaths(output)));
    };
  }
}

export default Version;
