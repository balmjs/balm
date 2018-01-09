const wiredep = require('wiredep').stream;

const errorHandler = () => {
  logger.warning(
    '[Wiredep]',
    `ENOENT: no such file or directory, open '${config.workspace}/bower.json'`
  );
};

class Wiredep extends Task {
  constructor() {
    super('wiredep');
  }

  get fn() {
    // Inject bower components
    return () => {
      gulp
        .src(`${config.source.css}/**/*.${config.styles.ext}`)
        .pipe(
          $.plumber({
            errorHandler
          })
        )
        // .pipe($.filter(file => file.stat && file.stat.size))
        .pipe(
          wiredep({
            cwd: config.workspace,
            ignorePath: /^(\.\.\/)+/
          })
        )
        .pipe(gulp.dest(config.source.css));

      gulp
        .src(`${config.source.base}/*.html`)
        .pipe(
          $.plumber({
            errorHandler
          })
        )
        .pipe(
          wiredep({
            cwd: config.workspace,
            ignorePath: /^(\.\.\/)*\.\./
          })
        )
        .pipe(gulp.dest(config.source.base));
    };
  }
}

export default Wiredep;
