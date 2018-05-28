const wiredep = require('wiredep').stream;

const errorHandler = () => {
  logger.warn(
    '[Wiredep]',
    `ENOENT: no such file or directory, open '${config.workspace}/bower.json'`,
    config.debug
  );
};

class Wiredep extends Task {
  constructor() {
    super('wiredep');
  }

  get fn() {
    return () => {
      return gulp
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
