import commonjs from 'rollup-plugin-commonjs';
import bowerResolve from 'rollup-plugin-bower-resolve';

class Rollup {
  get name() {
    return 'rollup';
  }
  get deps() {
    return [];
  }
  get fn() {
    return (input = '', output = '') => {
      if (input && output) {
        gulp.src(input, {
            read: false
          })
          .pipe($.plumber())
          .pipe($.rollup({
            plugins: [
              bowerResolve(),
              commonjs()
            ],
            // any option supported by Rollup can be set here, including sourceMap
            sourceMap: true
          }))
          .pipe($.sourcemaps.write('.')) // this only works if the sourceMap option is true
          .pipe(gulp.dest(output));
      }
    };
  }
}

export default Rollup;
