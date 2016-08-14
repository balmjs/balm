class Image extends Task {
  constructor() {
    super('images');
  }
  get fn() {
    return () => {
      return gulp.src(this.src)
        .pipe($.cache($.imagemin({
          progressive: true,
          interlaced: true,
          // don't remove IDs from SVGs, they are often used
          // as hooks for embedding and styling
          svgoPlugins: [{
            cleanupIDs: false
          }]
        })))
        .pipe(gulp.dest(this.dist));
    };
  }
}

export default Image;
