/**
 * Inline SVG
 */
class Svg {
  get name() {
    return 'svg';
  }
  get deps() {
    return [];
  }
  get fn() {
    return () => {
      // return gulp.src('app/svg/*.svg')
      //   .pipe($.svgSymbols())
      //   .pipe(gulp.dest(config.dist.img));
    };
  }
}

export default Svg;
