class Html {
  get name() {
    return 'html';
  }
  get deps() {
    let tasks = ['styles', 'scripts'];
    return tasks;
  }
  get fn() {
    return () => {
      let jsFilter = $.filter('**/*.js', {
        restore: true
      });
      let cssFilter = $.filter('**/*.css', {
        restore: true
      });
      let htmlFilter = $.filter(['**/*', '!**/*.html'], {
        restore: true
      });

      return gulp.src(config.source.html + '/*.html')
        .pipe($.useref({
          searchPath: [config.tmp.html, config.source.html, '.']
        })) // Concatenate with gulp-useref
        // .pipe($.if('*.js', $.uglify()))
        // .pipe($.if('*.css', $.cssnano({ safe: true, autoprefixer: false })))
        // .pipe($.if('*.html', $.htmlmin({ collapseWhitespace: true })))
        .pipe(jsFilter)
        .pipe($.uglify()) // Minify any javascript sources
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe($.cssnano({
          safe: true,
          autoprefixer: false
        })) // Minify any CSS sources
        .pipe(cssFilter.restore)
        .pipe(htmlFilter)
        .pipe($.rev()) // Rename the concatenated files (but not html file)
        .pipe(htmlFilter.restore)
        .pipe($.revReplace()) // Substitute in new filenames
        .pipe($.if('*.html', $.htmlmin({
          collapseWhitespace: true
        })))
        .pipe(gulp.dest(config.target.html));
    };
  }
}

export default Html;
