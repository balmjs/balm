class Image {
  get name() {
    return 'images';
  }
  get deps() {
    return [];
  }
  get fn() {
    return () => {
      let task = gulp.src(config.source.img + '/**/*')
        .pipe($.cache($.imagemin({
          progressive: true,
          interlaced: true,
          // don't remove IDs from SVGs, they are often used
          // as hooks for embedding and styling
          svgoPlugins: [{
            cleanupIDs: false
          }]
        })));

      if (config.cache) {
        return task.pipe(gulp.dest(config.buildDirectory + '/' + config.paths.target.img));
      } else {
        return task.pipe(gulp.dest(config.target.img));
      }
    };
  }
}

export default Image;
