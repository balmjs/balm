class Script {
  get name() {
    return 'scripts';
  }
  get deps() {
    return ['webpack'];
  }
  get fn() {
    return () => {
      let stream = gulp.src(config.tmp.js + '/**/*.{js,map}');

      if (!config.production) {
        return stream.pipe($.plumber())
          .pipe(reload({
            stream: true
          }));
      } else {
        if (!config.cache) {
          return stream.pipe(gulp.dest(config.target.js));
        } else {
          // copy the asynchronous scripts of tmp to target
          if (config.static) {
            let asyncSrc = [config.tmp.js + '/**/*.js'];
            for (let key in config.scripts.entry) {
              asyncSrc.push('!' + path.join(config.tmp.js, key) + '.js');
            }

            return gulp.src(asyncSrc)
              .pipe(gulp.dest(config.target.js));
          }
        }
      }
    };
  }
}

export default Script;
