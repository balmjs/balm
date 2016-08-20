class Image extends Task {
  constructor() {
    super('images');

    this.src = [config.source.img + '/**/*'];
    for (let imageFolder of config.sprites.image) {
      this.src.push('!' + config.source.img + '/' + imageFolder);
      this.src.push('!' + config.source.img + '/' + imageFolder + '/*.png');
    }
    for (let svgFolder of config.sprites.svg) {
      this.src.push('!' + config.source.img + '/' + svgFolder);
      this.src.push('!' + config.source.img + '/' + svgFolder + '/*.svg');
    }
  }
  get fn() {
    return () => {
      let stream = gulp.src(this.src);

      if (config.production) {
        stream = stream.pipe($.cache($.imagemin({
          progressive: true,
          interlaced: true,
          // don't remove IDs from SVGs, they are often used
          // as hooks for embedding and styling
          svgoPlugins: [{
            cleanupIDs: false
          }]
        })));
      }

      return stream.pipe(gulp.dest(this.dist));
    };
  }
}

export default Image;
