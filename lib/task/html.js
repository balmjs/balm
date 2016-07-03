class Html {
  get name() {
    return 'html';
  }
  get deps() {
    return ['styles', 'scripts'];
  }
  get fn() {
    return () => {
      let stream = gulp.src(config.source.html + '/*.html')
        .pipe($.useref({
          searchPath: [config.tmp.html, config.source.html, '.']
        }))
        // .pipe($.if('*.js', $.uglify())) // use webpack
        .pipe($.if('*.css', $.cssnano({
          safe: true,
          autoprefixer: false,
          discardComments: {
            removeAll: true
          }
        })));

      if (config.cache) {
        let htmlFilter = $.filter(['**/*', '!**/*.html'], {
          restore: true
        });

        stream = stream.pipe(htmlFilter)
          .pipe($.rev()) // Rename the concatenated files (but not html file)
          .pipe(htmlFilter.restore)
          .pipe($.revReplace()); // Substitute in new filenames
      }

      return stream.pipe($.if('*.html', $.htmlmin({
          collapseWhitespace: true
        })))
        .pipe(gulp.dest(config.target.html));
    };
  }
}

export default Html;
